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
        id: parseInt(socket.id),
        name,
        chatRoom,
        language,
      });

      if (error) {
        return callback(error);
      }

      if (user) {
        const emitMessage: Message = {
          user: "admin",
          text: `${user.name}, welcome to the room ${user.chatRoom}`,
          language: "English",
        };

        socket.emit("message", emitMessage);
        socket.broadcast.to(user.chatRoom).emit("message", emitMessage);

        socket.join(user.chatRoom);

        callback();
      }
    });

    socket.on("sendMessage", (message, callback) => {
      const user = users.getUser(parseInt(socket.id));

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

    socket.on("disconnect", () => {
      console.log(`${socket.id} has left the server`);
    });
  });
};
