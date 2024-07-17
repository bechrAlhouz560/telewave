import React, { useContext, useEffect } from "react";
import Message from "../../../api/telegram/message";
import CircleProgressBar from "../common/CircleProgressBar";
import style from "./message..module.css";
import { MdPlayCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { getActiveMode, getActiveTheme } from "../../features/theme/themeSlice";
import { getUser } from "../../features/auth/authSlice";

export interface MessageVoiceProps {
  message: Message;
}
export default function MessageVoice({ message }: MessageVoiceProps) {
  const voice = message.getVoice();
  const theme = useSelector(getActiveTheme);
  const activeThemeMode = useSelector(getActiveMode);
  const user = useSelector(getUser);
  useEffect(function () {}, []);
  return (
    <div
      className={style["audio-msg"] + " rounded-lg"}
      style={{
        background: message.isSender(user.id)
          ? theme.primary
          : activeThemeMode === "dark"
          ? "rgb(47, 47, 47)"
          : "#eeeeee",
      }}
    >
      <div
        className={style["audio-thumb"]}
        style={{
          background: theme.secondary,
        }}
      >
        <MdPlayCircle
          size={35}
          color={"white"}
          className="opacity-70"
          style={{ zIndex: 99 }}
        />
      </div>
      <div className="flex-1 flex items-center opacity-70">
        <div className="flex flex-col h-full justify-center flex-1"></div>
        <div className="h-full flex flex-col justify-center"></div>
      </div>
    </div>
  );
}
