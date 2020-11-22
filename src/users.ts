export interface User {
  name: string;
  id: string;
  chatRoom: string;
  language: string;
}

export class Users {
  private users: User[] = [];

  getUsers = () => {
    return this.users;
  };

  addUser = ({ id, name, chatRoom, language }: User) => {
    const existingUser = this.users.find(
      (user) =>
        user.chatRoom.trim().toLowerCase() === chatRoom.trim().toLowerCase() &&
        user.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (existingUser) {
      return {
        error: "Username is in use",
      };
    }

    const user: User = { id, name, chatRoom, language };

    this.users.push(user);

    return { user };
  };

  removeUser = (id: string) => {
    const idx = this.users.findIndex((user) => user.id === id);

    if (idx !== -1) {
      return this.users.splice(idx, 1)[0];
    }
  };

  getUser = (id: string) => {
    return this.users.find((user) => user.id === id);
  };

  getUsersInChatRoom = (chatRoom: string) => {
    return this.users.map((user) => {
      if (user.chatRoom === chatRoom && user.name) {
        return user.name;
      }
    });
  };
}
