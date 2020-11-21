// types
import { Socket } from "socket.io";
import { Users, User } from "../users";
import { getMessage, getError } from "./translation";

const users: Users = new Users();

export interface Message {
  user: string;
  text: string;
  language: string;
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
  });
};
