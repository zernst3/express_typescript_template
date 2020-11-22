// types
import { Socket } from "socket.io";
import { Users, User } from "../users";
import { getMessage, getError } from "../translation";

import Axios from "axios";

const { v4: uuidv4 } = require("uuid");

const AZURESUBSCRIPTIONKEY =
  process.env.AZURESUBSCRIPTIONKEY ||
  require("dotenv").config().parsed["process.env.AZURESUBSCRIPTIONKEY"] ||
  undefined;
const AZUREENDPOINT =
  process.env.AZUREENDPOINT ||
  require("dotenv").config().parsed["process.env.AZUREENDPOINT"] ||
  undefined;
const LOCATION =
  process.env.LOCATION ||
  require("dotenv").config().parsed["process.env.LOCATION"] ||
  undefined;

const users: Users = new Users();

export interface Message {
  user: string;
  text: string;
  language: string;
}

interface MessageData {
  message: Message;
  targetLanguage: string;
}

interface TranslatedMessage {
  originalText: string;
  message: Message;
  targetLanguage: string;
}

module.exports = (io: any) => {
  io.on("connection", (socket: Socket) => {
    console.log(`We have a new connection with id: ${socket.id}`);

    socket.on("login", ({ name, chatRoom, language }, callback) => {
      const { user, error } = users.addUser({
        id: socket.id,
        name,
        chatRoom,
        language,
      });

      if (error) {
        const emitMessage: Message = getError(language);
        socket.emit("message", emitMessage);
      }

      if (user) {
        const emitMessage: Message = getMessage(name, language);

        socket.emit("message", emitMessage);
        socket.broadcast.to(user.chatRoom).emit("message", emitMessage);

        socket.emit("userData", users.getUsersInChatRoom(chatRoom));
        socket.broadcast
          .to(user.chatRoom)
          .emit("userData", users.getUsersInChatRoom(chatRoom));

        socket.join(user.chatRoom);

        callback();
      }
    });

    socket.on("sendMessage", (message, callback) => {
      const user = users.getUser(socket.id);
      if (user) {
        const emitMessage: Message = {
          user: user.name,
          text: message,
          language: user.language,
        };
        io.to(user.chatRoom).emit("message", emitMessage);
      }

      callback();
    });

    socket.on("disconnectFromServer", () => {
      const user = users.getUser(socket.id);

      if (user) {
        const emitMessage: Message = {
          user: "Admin",
          text: `${user.name} has left the chat room`,
          language: "en",
        };

        io.to(user.chatRoom).emit("message", emitMessage);

        users.removeUser(socket.id);

        socket.broadcast
          .to(user.chatRoom)
          .emit("userData", users.getUsersInChatRoom(user.chatRoom));
      }

      console.log(`${socket.id} has left the server`);
    });

    socket.on("disconnect", () => {
      const user = users.getUser(socket.id);

      if (user) {
        const emitMessage: Message = {
          user: "Admin",
          text: `${user.name} has left the chat room`,
          language: "en",
        };

        io.to(user.chatRoom).emit("message", emitMessage);

        users.removeUser(socket.id);

        socket.broadcast
          .to(user.chatRoom)
          .emit("userData", users.getUsersInChatRoom(user.chatRoom));
      }

      console.log(`${socket.id} has left the server`);
    });

    socket.on("translate", async (messageData: MessageData) => {
      try {
        console.log("TRANSLATING =====================");
        if (!AZURESUBSCRIPTIONKEY || !AZUREENDPOINT || !LOCATION) {
          socket.emit("translatedText", "translationUnavailable");
        } else {
          const { data } = await Axios({
            baseURL: AZUREENDPOINT,
            url: "/translate",
            method: "post",
            headers: {
              "Ocp-Apim-Subscription-Key": AZURESUBSCRIPTIONKEY,
              "Ocp-Apim-Subscription-Region": LOCATION,
              "Content-type": "application/json",
              "X-ClientTraceId": uuidv4().toString(),
            },
            params: {
              "api-version": "3.0",
              from: messageData.message.language,
              to: messageData.targetLanguage,
            },
            data: [
              {
                text: messageData.message.text,
              },
            ],
            responseType: "json",
          });

          const translatedText: string = data[0]["translations"][0]["text"];

          let translatedMessage: TranslatedMessage = {
            originalText: messageData.message.text,
            message: messageData.message,
            targetLanguage: messageData.targetLanguage,
          };

          translatedMessage.message.text = translatedText;

          socket.emit("translatedMessage", translatedMessage);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
};
