import { getUserProfile, isSerializable } from "../../../api/global";
import { DialogType } from "../../../app/features/dialog/dialogSlice";
import { TelegramClient } from "telegram";
import { EntityLike, MessageLike } from "telegram/define";
import { Dialog } from "telegram/tl/custom/dialog";
import * as telegram from 'telegram';
import { SendMessageParams } from "telegram/client/messages";
import bigInt from "big-integer";
export interface IterParams {
  limit?: number;
  archived?: boolean;
}

export class Dialogs {
  private client: TelegramClient;
  constructor(client: TelegramClient) {
    this.client = client;
  }
  async get(params?: IterParams) {
    await this.client.connect();

    const dialogs = [];

    for await (const dialog of this.client.iterDialogs(params)) {
      
      dialogs.push(dialog);
    }
    // converting dialogs into serializable for redux
    return this.serialize(dialogs);
  }

  async serialize(dialogs: Dialog[]) {

    
    const serialized : DialogType[] = [];


    for await (let {
      archived,
      date,
      isChannel,
      isGroup,
      isUser,
      pinned,
      unreadCount,
      unreadMentionsCount,
      folderId,
      id,
      name,
      title,
      message,
      entity,
      draft,

      
    
    } of dialogs) {
    
      serialized.push({
        archived,
        date: new Date(date * 1000).toDateString(),
        isChannel,
        isGroup,
        isUser,
        pinned,
        unreadCount,
        unreadMentionsCount,
        folderId,
        id: id.toString(),
        name,
        title,
        message: {
          message: message.message,
          id: message.id,
          mentioned: message.mentioned,
          senderId: message.senderId.toString(),
          date : new Date(message.date * 1000).toUTCString(),
          chatId: message.chatId.toString(),
          mediaType : message?.media?.className,
          photoId : message?.photo?.id?.toString(),
          
        },
        photo : "",
        entity: entity.id.toString(),
        draft: draft.entity.id.toString(),
      })
    }


    return serialized;




 
  }
  
}

export class TChat {
  private client : TelegramClient;
  private entityLike : EntityLike;
  constructor (client : TelegramClient , entityLike : EntityLike)  {
    this.client = client;
    this.entityLike  = entityLike;
  }
  async getMessages(
    filter: {
      limit?: number;
      offsetId?: number;
    }
  ) {
    await this.client.connect();

    const response = await telegram.client.message.getMessages(
      this.client,
      this.entityLike,
      {
        limit: filter.limit,
        offsetId: filter.offsetId,
        
      }
    );
  
    return response.reverse();
  }


  async sendTextMessage (text : string) {
    await this.client.connect();
    const message = await this.client.sendMessage(this.entityLike , {
      message : text
    });

    return message;
  }

  async sendMessage (params : SendMessageParams) {
    const message = await this.client.sendMessage(this.entityLike , params );
    return message;
  }

  getEntity () {

    return this.entityLike;

  }


  async getChat () : Promise<telegram.Api.TypeChat> {

    const id  = bigInt(this.entityLike.toString());

    await this.client.connect();
    const request =  new telegram.Api.messages.GetChats({
       id : [id]
    });
    const response = await this.client.invoke(request);
    console.log(response)
    const chat = response.chats[0];
    return chat;
  }


  async getFullChat  () {
      const id = bigInt(this.entityLike.toString())
      const request = new telegram.Api.messages.GetFullChat({
        chatId : id
      })
      return await this.client.invoke(request);
  }

  async getChatTheme () {
    const request = new telegram.Api.account.GetChatThemes({})
    return await this.client.invoke(request);

  }
}
