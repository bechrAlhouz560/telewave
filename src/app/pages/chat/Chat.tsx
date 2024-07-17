import React, { useContext, useEffect, useRef, useState } from "react";
import { Location, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { DialogType } from "../../features/dialog/dialogSlice";
import { TChat } from "../../../api/telegram/dialogs";
import { TelegramClientContext } from "../../App";
import style from "./chat.module.css";
import { useSelector } from "react-redux";
import { getActiveTheme } from "../../features/theme/themeSlice";
import Message from "../../../api/telegram/message";
import MessageList from "../../components/message/MessageList";
import {
  useAddChatMessages,
  useChatMessages,
  useFirstMessage,
  useGetInitialized,
  useGetScrollY,
  useLastMessage,
  useNewChatMessages,
  useSetInitialized,
  useSetScrollY,
} from "../../contexts/ChatContext";
import {
  MdAudiotrack,
  MdOutlineAdd,
  MdMic,
  MdOutlineStickyNote2,
} from "react-icons/md";
import { Api } from "telegram";
import CircleProgressBar from "../../components/common/CircleProgressBar";

export function ChatInput({
  chatInstance,
  chatDiv,
}: {
  chatInstance: TChat;
  chatDiv: HTMLDivElement;
}) {
  const theme = useSelector(getActiveTheme);
  const [text, setText] = useState<string>("");
  const [sending, setSending] = useState(false);
  const { client } = useContext(TelegramClientContext);
  const addMessage = useAddChatMessages();

  function sendMessage() {
    if (!sending) {
      if (text) {
        setSending(true);
        chatInstance
          .sendTextMessage(text)
          .then(function (message) {
            const chatId = chatInstance.getEntity().toString();

            addMessage({
              chatId,
              newMessages: [new Message(client, message)],
              append: true,
              fromStart: false,
              lastScrollY: chatDiv?.scrollHeight || 100 ** 10,
            });
          })
          .finally(function () {
            setText("");
            setSending(false);
          });
      }
    }
  }
  return (
    <div
      className={style["chat-input"]}
      style={
        {
          // borderTop: "1px solid " + theme.border,
        }
      }
    >
      <div
        className={style["chat-btn"]}
        style={{
          background: theme.border + "95",
        }}
      >
        <MdOutlineAdd
          size={25}
          style={{
            color: theme.primary,
          }}
        />
      </div>
      <div
        className={style["chat-btn"]}
        style={{
          background: theme.border + "95",
        }}
      >
        <MdOutlineStickyNote2
          size={20}
          style={{
            color: theme.primary,
          }}
        />
      </div>

      <input
        type="text"
        className={style["chat-text"]}
        value={text}
        onKeyDown={function (e) {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        style={{
          background: theme.border + "95",

          color: theme.text + "70",
        }}
        onChange={function (e) {
          setText(e.currentTarget.value);
        }}
      />
      <style>
        {`
            .${style["chat-btn"]}:hover {
                background : ${theme.secondary}30 !important;
                transition : all ease .3s !important;
                cursor : pointer !important;


            }
          `}
      </style>

      <div
        className={style["chat-btn"]}
        style={{
          background: theme.border + "95",
        }}
      >
        <MdMic
          size={20}
          style={{
            color: theme.primary,
          }}
        />
      </div>
    </div>
  );
}
const Chat = () => {
  const params = useParams();
  const { client } = useContext(TelegramClientContext);
  const router: Location<DialogType> = useLocation();
  const theme = useSelector(getActiveTheme);
  const messages = useChatMessages(router.state.id);

  const newMessages = useNewChatMessages(router.state.id);
  const setMessages = useAddChatMessages();
  const firstMessage = useFirstMessage(router.state.id);
  const [loading, setLoading] = useState(false);
  const setScrollY = useSetScrollY();
  const initialized = useGetInitialized(router.state.id);
  const setInitialized = useSetInitialized();
  const scrollY = useGetScrollY(router.state.id);
  const chatRef = useRef<HTMLDivElement>();
  const [chatInstance, setChatInstance] = useState<TChat>();
  const [endOfList, setEndOfList] = useState(false);
  const [chatObject, setChatObject] = useState<Api.TypeChat>();
  const lastMessage = useLastMessage(router.state.id);

  const [initializing, setInialzing] = useState(false);

  useEffect(
    function () {
      if (chatInstance) {
        chatInstance
          .getChat()
          .then(function (response) {
            if (response) {
              setChatObject(response);
            }
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    },
    [chatInstance]
  );
  useEffect(
    function () {
      const chat: DialogType = router.state;
      const tchat = new TChat(client, chat.id);
      setChatInstance(tchat);

      (async function () {
        setLoading(true);
        if (!initialized) {
          try {
            const list = await tchat.getMessages({
              limit: 30,
            });

            setMessages({
              chatId: router.state.id,
              newMessages: list.map((m) => new Message(client, m)),
            });
            setInitialized(params.chatId, true);
          } catch (error) {
            console.log(error);
          }
        }

        setLoading(false);
      })();
    },
    [params.chatId]
  );

  useEffect(
    function () {
      if (lastMessage) {
        const lastChild = chatRef.current.lastElementChild;

        if (lastChild) {
          lastChild.scrollIntoView({
            block: "end",
            inline: "end",
          });
        }
      }
    },
    [lastMessage]
  );

  function chatScrollTo(scrollTop: number) {
    chatRef.current.scrollTo({
      top: scrollTop,
    });

    setScrollY(router.state.id, scrollTop);
  }

  async function loadMoreMessages() {
    if (!loading && !endOfList && messages.length) {
      if (firstMessage) {
        setLoading(true);
        try {
          const list = await chatInstance.getMessages({
            limit: 30,
            offsetId: firstMessage.id,
          });

          if (list.length) {
            if (chatRef.current.scrollTop <= 200) {
              chatScrollTo(chatRef.current.scrollHeight / 2);
            }
            setMessages({
              chatId: router.state.id,
              newMessages: list.map((m) => new Message(client, m)),
              fromStart: true,
            });
          } else {
            setEndOfList(true);
          }
        } catch (error) {
          console.log(error);
        }

        setLoading(false);
      }
    }
  }

  return (
    <div className={style["container"]}>
      <div
        className={style["header"]}
        style={
          {
            // borderBottom: "1px solid " + theme.border,
          }
        }
      >
        <div className={style["user-img"]}>
          <img src={router.state.photo} className="w-full absolute" alt="" />
        </div>

        <div className="flex flex-col justify-center h-full">
          <p
            style={{
              color: theme.text,
            }}
          >
            {router.state.title}
          </p>

          <span
            style={{
              color: theme.text,
            }}
            className="text-xs opacity-60"
          >
            {router.state.name}
          </span>
        </div>
      </div>

      <div
        className={style["chat-body"]}
        onScroll={function (e) {
          setScrollY(router.state.id, e.currentTarget.scrollTop);
          if (e.currentTarget.scrollTop < 200) {
            loadMoreMessages();
          }
        }}
        ref={chatRef}
      >
        <MessageList messages={messages} />

        <br></br>
        <br></br>
        <br></br>
      </div>

      {<ChatInput chatInstance={chatInstance} chatDiv={chatRef?.current} />}
    </div>
  );
};

export default Chat;
