import React, { useContext, useEffect, useState } from "react";
import {
  DialogType,
  updatePhotoProfile,
} from "../../features/dialog/dialogSlice";
import { TelegramClientContext } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { getActiveTheme } from "../../features/theme/themeSlice";
import { useLocation, useNavigate } from "react-router";
import style from "./conversation.module.css";
import { getUserProfile } from "../../../api/global";
import { useLastMessage } from "../../contexts/ChatContext";

export interface ConversationProps {
  dialog: DialogType;
}

export default function Conversation({ dialog }: ConversationProps) {
  const { client } = useContext(TelegramClientContext);
  const theme = useSelector(getActiveTheme);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // const lastMessage = useLastMessage(dialog.message.chatId);

  useEffect(function () {
    if (!dialog.photo) {
      getUserProfile(client, dialog.entity).then(function (photo) {
        dispatch(
          updatePhotoProfile({
            id: dialog.id,
            photo,
          })
        );
      });
    }
  }, []);

  return (
    <div
      onClick={() =>
        navigate(`/chats/${dialog.id}`, {
          state: dialog,
        })
      }
      className="flex gap-2 p-2 items-center bg-opacity-50 m-1 rounded-md cursor-pointer transition-all"
      style={{
        backgroundColor:
          isHovered || location.pathname === `/chats/${dialog.id}`
            ? theme.secondary + "20"
            : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={style["user-img"]}>
        <img
          src={
            dialog.photo ||
            "https://ui-avatars.com/api/?background=random&name=" + dialog.name
          }
          loading="lazy"
          className="w-full absolute"
          alt=""
        />
      </div>
      <div className="flex flex-col">
        <p
          className={style["no-wrap"]}
          style={{
            color: theme.text,
          }}
        >
          {dialog.title}
        </p>
        <p
          className={`opacity-50 text-sm ${style["no-wrap"]}`}
          style={{
            color: theme.text,
          }}
        >
          {dialog?.message?.message}
        </p>
      </div>
    </div>
  );
}
