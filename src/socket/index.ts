// types
import { Socket } from "socket.io";

import { Users, User } from "../users";

const users: Users = new Users();

interface Message {
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
        return callback(error);
      }

      if (user) {
        const emitMessage: Message = {
          user: "Admin",
          text: `${name}, welcome to the room: ${chatRoom}`,
          language: "English",
        };

        socket.emit("message", emitMessage);
        socket.broadcast.to(user.chatRoom).emit("message", emitMessage);

        socket.emit("userJoin", users.getUsersInChatRoom(chatRoom));
        socket.broadcast.to(user.chatRoom).emit("userJoin", [user.name]);

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
          language: "English",
        };

        io.to(user.chatRoom).emit("message", emitMessage);
        io.to(user.chatRoom).emit(
          "userLeave",
          users.getUsersInChatRoom(user.chatRoom)
        );

        users.removeUser(socket.id);

        socket.broadcast
          .to(user.chatRoom)
          .emit("userLeave", users.getUsersInChatRoom(user.chatRoom));
      }

      console.log(`${socket.id} has left the server`);
    });

    socket.on("disconnect", () => {
      const user = users.getUser(socket.id);

      if (user) {
        const emitMessage: Message = {
          user: "Admin",
          text: `${user.name} has left the chat room`,
          language: "English",
        };

        io.to(user.chatRoom).emit("message", emitMessage);

        users.removeUser(socket.id);

        socket.broadcast
          .to(user.chatRoom)
          .emit("userLeave", users.getUsersInChatRoom(user.chatRoom));
      }

      console.log(`${socket.id} has left the server`);
    });
  });
};
