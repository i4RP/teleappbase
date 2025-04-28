interface TelegramWebApp {
  WebApp: {
    openLink: (url: string) => void;
  };
}

interface Window {
  Telegram?: TelegramWebApp;
}