import React, { useContext, useEffect } from "react";
// @ts-ignore
import style from "./dashboard.module.css";
import { Dialogs } from "../../../api/telegram/dialogs";
import { TelegramClientContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { getActiveTheme } from "../../features/theme/themeSlice";
import { Link, Route, Routes } from "react-router-dom";
import SideBar from "../../components/sidebar/SideBar";
import Chats from "../chats/Chats";
import Groups from "../groups/Groups";
import Chat from "../chat/Chat";
import TelegramEvents from "telegram/events";
import * as telegram from "telegram";
import { useAddChatMessages } from "../../contexts/ChatContext";

import {
  UpdateChatHandler,
  UpdateMessageHandler,
  UpdateUserHandler,
} from "../../../api/telegram/eventHandler";
const events: typeof TelegramEvents = telegram.TelegramClient.events;

export default function Dashboard() {
  const { client } = useContext(TelegramClientContext);
  const theme = useSelector(getActiveTheme);

  const addMessages = useAddChatMessages();

  const dispatch = useDispatch();

  // useEffect(function () {
  //   function messageUpdateEvent(update: TelegramEvents.NewMessageEvent) {
  //     const message = new Message(client, update.message);
  //     addMessages(message.getChatId(), [message]);

  //     const newMessage = {
  //       chatId: message.getChatId(),
  //       date: message.createdAt().toUTCString(),
  //       id: message.id,
  //       mentioned: message.getMessage().mentioned,
  //       message: message.getText(),
  //       senderId: message.getSenderId(),
  //     };

  //     const action = updateDialogMessage({
  //       id: message.getChatId(),
  //       newMessage,
  //     });
  //     dispatch(action);
  //   }

  //   function rawUpdateEvent(update: telegram.Api.TypeUpdate) {
  //     if (update.className === "UpdateUserTyping") {
  //       const userId = update.userId.toString();
  //       if (update.action.className === "SendMessageTypingAction") {
  //         console.log(userId, " is typing...");
  //       }

  //       if (update.action.className === "SendMessageCancelAction") {
  //         console.log(userId, "cancelled typing");
  //       }
  //     }

  //     if (update.className === "UpdateUserStatus") {
  //       if (update.status.className === "UserStatusOffline") {

  //         update.status.wasOnline
  //       }
  //     }
  //   }
  //   const builder = new events.NewMessage({});

  //   const rawBuilder = new events.Raw({});

  //   client.addEventHandler(messageUpdateEvent, builder);

  //   client.addEventHandler(rawUpdateEvent, rawBuilder);
  //   return function () {
  //     client.removeEventHandler(messageUpdateEvent, builder);
  //     client.removeEventHandler(rawUpdateEvent, rawBuilder);
  //   };
  // }, []);

  useEffect(function () {
    const builder = new events.Raw({});

    const eventHandlerFunction = (event: telegram.Api.TypeUpdate) => {
      new UpdateMessageHandler(event, dispatch, client, addMessages);
      new UpdateUserHandler(event, dispatch);
      new UpdateChatHandler(event, dispatch);
    };

    client.addEventHandler(eventHandlerFunction, builder);

    return function () {
      client.removeEventHandler(eventHandlerFunction, builder);
    };
  }, []);
  return (
    <div
      className={style["container"]}
      style={{ background: theme.background }}
    >
      <SideBar></SideBar>

      <div className={style["body"]}>
        <Routes>
          <Route path="/" element={<>Hello !</>}></Route>
          <Route path="/chats" Component={Chats}>
            <Route path="/chats" element={<>Help !</>}></Route>
            <Route path="/chats/:chatId" Component={Chat}></Route>
          </Route>
          <Route path="/groups" Component={Groups} />
        </Routes>
      </div>
    </div>
  );
}
