import { Message } from "./index";

interface languageObject {
  [key: string]: Message;
}

export const getMessage = (name: string, language: string) => {
  const langObj: languageObject = {
    en: {
      user: "Admin",
      text: `${name}, welcome to the server!`,
      language: "en",
    },
    es: {
      user: "Admin",
      text: `${name}, bienvenido al servidor!`,
      language: "es",
    },
    ru: {
      user: "Admin",
      text: `${name}, добро пожаловать на сервер!`,
      language: "ru",
    },
    fr: {
      user: "Admin",
      text: `${name}, bienvenue sur le serveur!`,
      language: "fr",
    },
    de: {
      user: "Admin",
      text: `${name}, willkommen auf dem Server!`,
      language: "de",
    },
    it: {
      user: "Admin",
      text: `${name}, benvenuto al server!`,
      language: "it",
    },
    pt: {
      user: "Admin",
      text: `${name}, bem-vindo ao servidor!`,
      language: "pt",
    },
    "zh-Hans": {
      user: "Admin",
      text: `${name}, 欢迎来到服务器!`,
      language: "zh-Hans",
    },
    ja: {
      user: "Admin",
      text: `${name}, サーバーへようこそ!`,
      language: "ja",
    },
    hi: {
      user: "Admin",
      text: `${name}, सर्वर में आपका स्वागत है!`,
      language: "hi",
    },
  };

  return langObj[language];
};

export const getError = (language: string) => {
  const langObj: languageObject = {
    en: {
      user: "Admin",
      text: `Error, user already in chat room, please login with a different name.`,
      language: "en",
    },
    es: {
      user: "Admin",
      text: `Error, el usuario ya está en la sala de chat, inicie sesión con un nombre diferente.`,
      language: "es",
    },
    ru: {
      user: "Admin",
      text: `Ошибка, пользователь уже находится в чате, войдите под другим именем.`,
      language: "ru",
    },
    fr: {
      user: "Admin",
      text: `Erreur, utilisateur déjà dans la salle de chat, veuillez vous connecter avec un nom différent.`,
      language: "fr",
    },
    de: {
      user: "Admin",
      text: `Fehler, Benutzer bereits im Chatraum, bitte mit einem anderen Namen anmelden.`,
      language: "de",
    },
    it: {
      user: "Admin",
      text: `Errore, utente già nella chat room, effettua il login con un nome diverso.`,
      language: "it",
    },
    pt: {
      user: "Admin",
      text: `Erro, usuário já está na sala de chat, faça o login com um nome diferente.`,
      language: "pt",
    },
    "zh-Hans": {
      user: "Admin",
      text: `错误，用户已经在聊天室中，请使用其他名称登录。`,
      language: "zh-Hans",
    },
    ja: {
      user: "Admin",
      text: `エラー、ユーザーはすでにチャットルームにいます。別の名前でログインしてください。`,
      language: "ja",
    },
    hi: {
      user: "Admin",
      text: `त्रुटि, पहले से ही चैट रूम में उपयोगकर्ता, कृपया एक अलग नाम से लॉगिन करें।`,
      language: "hi",
    },
  };

  return langObj[language];
};
