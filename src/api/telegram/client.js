import { TelegramClient } from "telegram";
import { StoreSession, StringSession } from "telegram/sessions";
import { API_HASH, API_ID } from "../global";

const storeSession = new StoreSession("tele-session");

const client = new TelegramClient(storeSession, API_ID, API_HASH, {
  connectionRetries: 5,
});

export default client;
