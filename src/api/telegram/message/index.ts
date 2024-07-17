import bigInt from "big-integer";
import {  getUserProfile } from "../../../api/global";
import * as telegram from "telegram";
import { MessageButton } from "telegram/tl/custom/messageButton";

export type ClassName =
  | "DocumentAttributeImageSize"
  | "DocumentAttributeAnimated"
  | "DocumentAttributeSticker"
  | "DocumentAttributeVideo"
  | "DocumentAttributeAudio"
  | "DocumentAttributeFilename"
  | "DocumentAttributeHasStickers"
  | "DocumentAttributeCustomEmoji";

export interface MediaInfo {
  classNames: ClassName[];
  attributes: {
    [key: string]: telegram.Api.TypeDocumentAttribute;
  };
}
class Message {
  private message: telegram.Api.Message;
  private client: telegram.TelegramClient;
  public id: number;
  constructor(client: telegram.TelegramClient, message: telegram.Api.Message) {
    this.client = client;
    this.message = message;
    this.id = message.id;
  }

  static async setTyping(client: telegram.TelegramClient, username: string) {
    await client.connect(); // This assumes you have already authenticated with .start()
    const result = await client.invoke(
      new telegram.Api.messages.SetTyping({
        peer: username,
        action: new telegram.Api.SendMessageTypingAction(),
        topMsgId: 43,
      })
    );

    return result;
  }

  async delete() {
    const response = await this.message.delete();
    return response[0];
  }

  async editText(text: string) {
    const response = await this.message.edit({
      text: text,
    });
    this.message = response;
    return this.message;
  }

  async downloadMedia(asLink: boolean) {
    const result = await this.message.downloadMedia();
    if (asLink) {
      const blob = new Blob([result]);
      return URL.createObjectURL(blob);
    } else {
      return result;
    }
  }

  getMessage() {
    return this.message;
  }

  getText() {
    return this.message?.message || "";
  }

  getMediaInfo(type ?: ClassName) {
    let infos: MediaInfo = { classNames: [], attributes: {} };
    if (this.message?.document?.attributes) {
      const attributes = this.message.document.attributes;

      if (type)
      {
         for (const attr of attributes) {
            if (attr.className === type) {
              return attr
            }
         }
      }

      for (let attr of attributes) {
        const json = attr.toJSON();

        // @ts-ignore
        delete json.className;
        infos = {
          // @ts-ignore
          attributes: {
            ...infos.attributes,
            ...json,
          },
          classNames: [...infos.classNames, attr.className],
        };
      }
    }

    return infos;
  }

  async click() {
    const response = await this.message.click({});

    return response;
  }

  async getChat() {
    const chat = await this.message.getChat();
    return chat.toJSON();
  }

  isSender(userId: string) {
    return this.message.senderId.toString() === userId;
  }

  isSeen() {
    return !this.message.mediaUnread;
  }

  createdAt() {
    return new Date(this.message.date * 1000);
  }

  async getPhoto(
    progressCallback?: (
      downloaded: bigInt.BigInteger,
      fullSize: bigInt.BigInteger,
      ...args: any[]
    ) => void
  ): Promise<null | string> {
    if (this.message.photo) {
      if (this.message.photo.className === "Photo") {
        const photo = this.message.photo;

        const photoInfo = this.getPhotoSize();
        const size = bigInt.fromArray([photoInfo.size]);

        await this.client.connect();
        const buffer = await this.client.downloadFile(
          new telegram.Api.InputPhotoFileLocation({
            id: photo.id,
            accessHash: photo.accessHash,
            fileReference: photo.fileReference,
            thumbSize: "Y",
          }),
          {
            dcId: photo.dcId,

            fileSize: size,

            progressCallback,
          }
        );

        const blob = new Blob([buffer]);

        return URL.createObjectURL(blob);
      }
    }
    return null;
  }

  getPhotoSize() {
    if (this.message.photo) {
      if (this.message.photo.className === "Photo") {
        const photo = this.message.photo;
        for (let type of photo.sizes) {
          if (type.className === "PhotoSize") {
            return type;
          } else if (type.className === "PhotoSizeProgressive") {
          }
        }
      }
    }

    return null;
  }

  getPhotoId() {
    return this.message?.photo?.id.toString();
  }
  hasPhoto() {
    return !!this.message.photo;
  }

  getChatId() {
    return this.message.chatId.toString();
  }

  getVoice () {
    return this.message.voice;
  }

  getSenderId() {
    return this.message.senderId.toString();
  }

  getButtons() {
    let btns: MessageButton[][] = [];
    if (this.message.buttons) {
      btns = this.message.buttons;
    }
    return btns;
  }

  getEntities() {
    return this.message.entities;
  }

  isChannel() {
    return this.message.isChannel;
  }

  isGroup() {
    return this.message.isGroup;
  }
  isReply() {
    return this.message.isReply;
  }

  isPrivate() {
    return this.message.isPrivate;
  }
  getSenderInfo() {
    const sender = this.message.sender;
    return sender;
  }

  async getSenderPhoto() {
    const sender = this.message.sender;
    if (sender) {
      if (
      sender.className === "Channel" ||
      sender.className === "Chat" ||
      sender.className === "User"
    ) {
      if (sender.photo) {
        if (
          sender.photo.className === "ChatPhoto" ||
          sender.photo.className === "UserProfilePhoto"
        ) {
          return await getUserProfile(this.client, sender.id.toString());
        }
      }
    }
    }

    return "";
  }

  getSenderPhotoId() {
    const sender = this.message.sender;
   if (sender) {
     if (
      sender.className === "Channel" ||
      sender.className === "Chat" ||
      sender.className === "User"
    ) {
      if (sender.photo) {
        if (
          sender.photo.className === "ChatPhoto" ||
          sender.photo.className === "UserProfilePhoto"
        ) {
          return sender.photo.photoId.toString();
        }
      }
    }
   }

    return "";
  }


  getReplyTo () {
      return this.message.replyTo;;
  }
  async getComments () : Promise<[]>{
    return [];
  }

  getAudioInfos () {
    return this.message.audio;

  }
}

export default Message;
