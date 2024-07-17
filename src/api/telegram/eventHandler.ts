import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { Api, TelegramClient } from "telegram";
import Message from "./message";
import { updateDialogMessage } from "../../app/features/dialog/dialogSlice";




export abstract class EventHandler {
  protected dispatch: Dispatch<UnknownAction>;
  protected eventUpdate: Api.TypeUpdate;

  constructor(eventUpdate: Api.TypeUpdate, dispatch: Dispatch<UnknownAction>) {
    this.dispatch = dispatch;
    this.eventUpdate = eventUpdate;
  }
}
export class UpdateUserHandler extends EventHandler {
  constructor(eventUpdate: Api.TypeUpdate, dispatch: Dispatch<UnknownAction>) {
    super(eventUpdate, dispatch);
    
  }
}

export class UpdateMessageHandler extends EventHandler {
  private client: TelegramClient;
  private addMessage: (
    options : {
      chatId: string,
    newMessages: Message[],
    lastScrollY?: number,
    append ?: boolean,
    fromStart ?: boolean
    }
  ) => void;
  constructor(
    eventUpdate: Api.TypeUpdate,
    dispatch: Dispatch<UnknownAction>,
    client: TelegramClient,
    addMessage: (
      options :  {
        chatId: string,
      newMessages: Message[],
      lastScrollY?: number
      }
    ) => void
  ) {
    super(eventUpdate, dispatch);
    this.client = client;
    this.addMessage  = addMessage;
    if (eventUpdate.className === "UpdateNewMessage") {
        this.handleNewMessage(eventUpdate);
    }
  }

  handleNewMessage(event: Api.UpdateNewMessage) {
    if (event.message.className === "Message") {
      const message = new Message(this.client, event.message);
      this.addMessage({
        chatId : message.getChatId(), newMessages  :  [message],
        append : true,
        fromStart : false,

        lastScrollY : 100 ** 100
        
      });
      const newMessage = {
        chatId: message.getChatId(),
        date: message.createdAt().toUTCString(),
        id: message.id,
        mentioned: message.getMessage().mentioned,
        message: message.getText(),
        senderId: message.getSenderId(),
      };

      const action = updateDialogMessage({
        id: message.getChatId(),
        newMessage,
      });
      this.dispatch(action);
    }
  }
}


export class UpdateChatHandler extends EventHandler {
  constructor(eventUpdate: Api.TypeUpdate, dispatch: Dispatch<UnknownAction>) {
    super(eventUpdate, dispatch);
    this.handleTypingChat();
  }

  handleTypingChat () {
    if (this.eventUpdate.className === "UpdateChannelUserTyping") {
        // ...
    } else if (this.eventUpdate.className === "UpdateUserTyping") {
        // ...
    }
    else if (this.eventUpdate.className === "UpdateChatUserTyping") {
        // ...
    }
  }
}