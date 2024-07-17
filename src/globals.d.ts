// src/globals.d.ts
import * as Telegram from 'telegram';
import * as FS from 'fs';



declare global {
  var telegram: typeof Telegram,
  MAIN_WINDOW_VITE_DEV_SERVER_URL : string,
  MAIN_WINDOW_VITE_NAME : string;

}

export {};
