export interface User {
  name: string;
  id: number;
  chatRoom: string;
  language: string;
}

export class Users {
  private users: User[] = [];

  getUsers = () => {
    return this.users;
  };

  addUser = ({ id, name, chatRoom, language }: User) => {
    name = name.trim().toLowerCase();
    chatRoom = chatRoom.trim().toLowerCase();

    const existingUser = this.users.find(
      (user) => user.chatRoom === chatRoom && user.name === name
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

  removeUser = (id: number) => {
    const idx = this.users.findIndex((user) => user.id === id);

    if (idx !== -1) {
      return this.users.splice(idx, 1)[0];
    }
  };

  getUser = (id: number) => {
    return this.users.find((user) => user.id === id);
  };

  getUsersInChatRoom = (chatRoom: string) => {
    return this.users.filter((user) => user.chatRoom === chatRoom);
  };
}
