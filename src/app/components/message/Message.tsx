import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./message..module.css";
import MessageAPI, { ClassName } from "../../../api/telegram/message";
import { useDispatch, useSelector } from "react-redux";
import { getActiveMode, getActiveTheme } from "../../features/theme/themeSlice";
import { getUser } from "../../features/auth/authSlice";
import { formatDateHM } from "../../../api/global";

export const IMAGE_SCALE = 1.08;
// @ts-ignore
import bgBlurred from "../../../assets/bg/white-bg.jpg";
import {
  addPhoto,
  selectOnePhoto,
} from "../../features/messagePhoto/messagePhotoSlice";
import { RootState } from "../../store";
import { message } from "telegram/client";
import { MessageButton as MsgButton } from "telegram/tl/custom/messageButton";
import { useSpring, animated } from "@react-spring/web";
import { Api, utils, helpers } from "telegram";
import { Entity } from "telegram/define";
import { MessageText } from "./MessageText";
import {
  addProfilePhoto,
  selectOneProfilePhoto,
} from "../../features/profilePhoto/profilePhotoSlice";
import { useSelectMessage } from "../../contexts/ChatContext";
import MessageAudio from "./MessageAudio";
import MessageVoice from "./MessageVoice";

export interface MessageProps {
  message: MessageAPI;
  prev?: MessageAPI;

  next?: MessageAPI;
}

export interface MessagePhotoProps {
  message: MessageAPI;
}

export function MessagePhoto({ message }: MessagePhotoProps) {
  const messagePhoto = useSelector(function (state: RootState) {
    return selectOnePhoto(state, message.getPhotoId());
  });
  const dispatch = useDispatch();
  const [photoInfo, setPhotoInfo] = useState<any>({});
  useEffect(function () {
    if (!messagePhoto) {
      message
        .getPhoto(function (downloaded, fullSize) {})
        .then(function (photo) {
          if (photo) {
            dispatch(
              addPhoto({
                photoId: message.getPhotoId(),
                url: photo,
              })
            );
          }
        });
    }

    setPhotoInfo(message.getPhotoSize() || {});
  }, []);

  return (
    <img
      src={!messagePhoto ? bgBlurred : messagePhoto}
      // @ts-ignore

      style={{
        height: photoInfo.h * IMAGE_SCALE,
        // minHeight: photoInfo.h * 1.2,
        width: photoInfo.w * IMAGE_SCALE,
        // minWidth: photoInfo.w * 1.2,
        scale: 2,
        marginBottom: message.getText() ? 2 : undefined,
      }}
      alt=""
      className="rounded-lg"
    />
  );
}

export function MessageButton({
  message,
  button,
  setButtons,
}: {
  message: MessageAPI;
  button: MsgButton;
  setButtons: any;
}) {
  const theme = useSelector(getActiveTheme);
  const user = useSelector(getUser);
  const [loading, setLoading] = useState(false);

  const animatedStyles = useSpring({
    opacity: loading ? 0.5 : 1,
    config: { duration: 200 },
  });

  return (
    <animated.button
      className="p-2 rounded-lg hover:opacity-70 cursor-pointer transition-all"
      onClick={function () {
        setLoading(true);
        button
          .click({})
          .then(async function () {
            const newButtons = await message.getMessage().getButtons();
            setButtons(newButtons);
          })
          .finally(function () {
            setLoading(false);
          });
      }}
      style={{
        ...animatedStyles,
        width: "60%",
        backgroundColor: message.isSender(user.id)
          ? theme.primary
          : "rgb(76, 76, 76)",
        marginLeft: !message.isSender(user.id) ? "auto" : undefined,
        color: "white",
      }}
      disabled={loading}
    >
      {button.text}
    </animated.button>
  );
}
export function MessageButtons({ message }: { message: MessageAPI }) {
  const [elements, setElements] = useState<JSX.Element[][]>([]);

  const [buttons, setButtons] = useState<MsgButton[][]>([]);

  useEffect(() => {
    const btnList = message.getButtons();
    if (btnList.length) {
      setButtons(buttons);
    }
  }, []);

  useEffect(
    function () {
      const newElements: JSX.Element[][] = [];

      for (const btnList of buttons) {
        const list: JSX.Element[] = [];
        let index = 0;
        for (let subBtn of btnList) {
          list.push(
            <MessageButton
              setButtons={setButtons}
              key={index}
              button={subBtn}
              message={message}
            />
          );

          index += 1;
        }

        newElements.push(list);
      }

      setElements(newElements);
    },
    [buttons]
  );

  return (
    <div className="flex flex-col gap-1 ">
      {elements.map((elementRow, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {elementRow}
        </div>
      ))}
    </div>
  );
}
export function MessageContent({ message }: { message: MessageAPI }) {
  const [attributes, setAttributes] = useState<{
    [key: string]: Api.TypeDocumentAttribute;
  }>({});
  const [type, setType] = useState<ClassName[]>([]);

  function checkType(className: ClassName) {
    for (const t of type) {
      if (t === className) return true;
    }
    return false;
  }
  useEffect(function () {
    const mediaInfo = message.getMediaInfo();

    // @ts-ignore
    setAttributes(mediaInfo.attributes);

    // @ts-ignore
    setType(mediaInfo.classNames);
  }, []);
  return (
    <>
      {message.hasPhoto() ? (
        <MessagePhoto message={message} />
      ) : message.getVoice() ? (
        <MessageVoice message={message} />
      ) : checkType("DocumentAttributeAudio") ? (
        <MessageAudio message={message}></MessageAudio>
      ) : null}
      {message.getText() ? <MessageText message={message} /> : null}
    </>
  );
}
export default function Message({ message, prev, next }: MessageProps) {
  const theme = useSelector(getActiveTheme);
  const activeThemeMode = useSelector(getActiveMode);
  const user = useSelector(getUser);
  const datePrev = prev ? formatDateHM(prev.createdAt()) : null;
  const date = formatDateHM(message.createdAt());
  const gDate = new Date(message.createdAt()).toDateString();
  const prevGDate = prev ? new Date(prev.createdAt()).toDateString() : null;
  const [senderInfo, setSenderInfo] = useState<Entity>();
  const dispatch = useDispatch();

  const [springs, api] = useSpring(() => {
    return {
      from: {
        left: 0,
        right: 0,
      },

      config: {
        duration: 300,
      },
    };
  });

  const replyToMessage = useSelectMessage(
    message.getChatId(),
    message.getReplyTo()?.replyToMsgId
  );
  const [replyTo, setReplyTo] = useState<MessageAPI>();
  const senderPhoto = useSelector(function (state: RootState) {
    return selectOneProfilePhoto(state, message.getSenderPhotoId());
  });
  function getTitle() {
    if (senderInfo)
      return senderInfo.className === "Channel"
        ? senderInfo.title
        : senderInfo.className === "User"
        ? senderInfo.deleted
          ? "Deleted Account"
          : (senderInfo.firstName || "") +
            (senderInfo.lastName ? " " + senderInfo.lastName : "")
        : null;
  }

  function getColor() {
    if (senderInfo)
      return senderInfo.className === "Channel" ||
        senderInfo.className === "User"
        ? senderInfo?.color?.color || ""
        : "";
  }

  function shouldShowPhoto() {
    const check1 =
      (prev ? prev.getSenderId() === message.getSenderId() : true) &&
      (next ? next.getSenderId() !== message.getSenderId() : true);

    const check2 =
      (prev ? prev.getSenderId() !== message.getSenderId() : true) &&
      (next ? next.getSenderId() !== message.getSenderId() : true);

    return check1 || check2;
  }

  function shouldShowTitle() {
    const check1 =
      message.getText() && (message.isChannel() || message.isGroup());
    const check2 = prev?.getSenderId() !== message.getSenderId();
    return check1 && check2;
  }
  useEffect(
    function () {
      setSenderInfo(message.getSenderInfo());

      if (!senderPhoto && message.getSenderPhotoId()) {
        message.getSenderPhoto().then(function (photo) {
          const action = addProfilePhoto({
            photoId: message.getSenderPhotoId(),
            url: photo,
          });

          dispatch(action);
        });
      }
    },
    [message]
  );

  useEffect(function () {
    if (replyToMessage) {
      setReplyTo(replyToMessage);
    }
  }, []);

  return (
    <animated.div className={style["message"]} id={message.id.toString()}>
      {gDate !== prevGDate ? (
        <p
          style={{
            color: theme.text,
          }}
          className="opacity-50 text-center text-sm pb-2"
        >
          {gDate}
        </p>
      ) : null}

      <animated.div
        className="flex gap-2 mb-2"
        style={{
          position: "relative",
          ...springs,
        }}
      >
        {message.isSender(user.id) && shouldShowPhoto() ? (
          <div className={style["user-img"]}>
            <img
              src={
                senderPhoto ||
                "https://ui-avatars.com/api/?background=random&name=" +
                  getTitle()
              }
              className="w-full absolute"
              alt=""
            />
          </div>
        ) : null}
        <div
          className={style["message-text"]}
          style={{
            boxShadow: "rgba(149 157 165 0.2) 0px 8px 24px;",

            marginRight:
              !message.isSender(user.id) && !shouldShowPhoto() ? "38px" : null,
            backgroundColor: message.getText()
              ? message.isSender(user.id)
                ? theme.primary
                : activeThemeMode === "dark"
                ? "rgb(47, 47, 47)"
                : "#eeeeee"
              : "transparent",

            marginLeft: !message.isSender(user.id)
              ? "auto"
              : !shouldShowPhoto()
              ? "38px"
              : null,
            width: message.hasPhoto()
              ? message.getPhotoSize().w * IMAGE_SCALE
              : message.getButtons().length
              ? "60%"
              : "fit-content",
          }}
        >
          {shouldShowTitle() ? (
            <p
              className="font-semibold px-1  cursor-pointer hover:underline"
              style={{
                color: theme.secondary,
              }}
            >
              {getTitle()}
            </p>
          ) : null}
          <MessageContent message={message}></MessageContent>

          <div className="flex w-full ">
            <p className="opacity-50 text-center text-xs text-white ml-auto">
              {date}
            </p>
          </div>
        </div>

        {!message.isSender(user.id) && shouldShowPhoto() ? (
          <div className={style["user-img"]}>
            <img
              src={
                senderPhoto ||
                "https://ui-avatars.com/api/?background=random&name=" +
                  getTitle()
              }
              className="w-full absolute"
              alt=""
            />
          </div>
        ) : null}
      </animated.div>
      <MessageButtons message={message} />
    </animated.div>
  );
}
