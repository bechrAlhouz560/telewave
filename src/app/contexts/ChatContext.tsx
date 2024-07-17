import React, { useContext } from "react";
import Message from "../../api/telegram/message";

export interface ChatContextType {
  chats: {
    [chatId: string]: {
      messages: Message[];
      lastScrollY: number;
      initialized?: boolean;
    };
  };
  setChats?: React.Dispatch<React.SetStateAction<ChatContextType["chats"]>>;
}

export const ChatContext = React.createContext<ChatContextType>({
  chats: {},
});

export function useChatMessages(chatId: string): Message[] {
  const { chats } = useContext<ChatContextType>(ChatContext);

  if (!chats[chatId]) {
    return [];
  }

  return chats[chatId]?.messages || [];
}

export function useNewChatMessages(chatId: string): Message[] {
  const { chats } = useContext<ChatContextType>(ChatContext);

  if (!chats[chatId] || !chats[chatId].messages) {
    return [];
  }
  const messages = chats[chatId]?.messages;
  return messages.slice(messages.length - 31, messages.length - 1);
}

export function useAddChatMessages() {
  const { chats, setChats } = useContext(ChatContext);

  const addChatMessages = ({
    chatId,
    newMessages,
    lastScrollY = null,
    append = false,
    fromStart = false,
  }: {
    chatId: string;
    newMessages: Message[];
    lastScrollY?: number;
    append?: boolean;
    fromStart?: boolean;
  }) => {
    if (setChats) {
      setChats((prevChats) => {
        const chat = prevChats[chatId] || { messages: [], lastScrollY: 0 };

        // Determine the new messages array
        const updatedMessages = append
          ? fromStart
            ? [...newMessages, ...chat.messages]
            : [...chat.messages, ...newMessages]
          : [...(newMessages || []), ...(chat?.messages || [])];

        // Determine the new lastScrollY value
        const updatedScrollY =
          lastScrollY !== null ? lastScrollY : chat.lastScrollY;

        return {
          ...prevChats,
          [chatId]: {
            messages: updatedMessages,
            lastScrollY: updatedScrollY,
          },
        };
      });
    }
  };

  return addChatMessages;
}

export function useSetScrollY() {
  const { chats, setChats } = useContext(ChatContext);

  const setScrollY = (chatId: string, scrollY: number) => {
    if (setChats) {
      setChats((prevChats) => ({
        ...prevChats,
        [chatId]: {
          ...prevChats[chatId],
          lastScrollY: scrollY,
        },
      }));
    }
  };

  return setScrollY;
}

export function useFirstMessage(chatId: string) {
  const { chats } = useContext(ChatContext);
  const chat = chats[chatId];
  return chat ? (chat.messages?.length ? chat.messages[0] : null) : null;
}

export function useSelectMessage(
  chatId?: string,
  msgId?: number
): Message | null {
  const { chats } = useContext(ChatContext);

  if (chatId && msgId) {
    const chat = chats[chatId];

    if (chat && chat.messages) {
      for (const message of chat.messages) {
        if (message.id === msgId) {
          return message;
        }
      }
    }
  }

  return null;
}
export function useLastMessage(chatId: string): Message {
  const { chats } = useContext(ChatContext);
  const chat = chats[chatId];
  return chat && chat.messages ? chat.messages[chat.messages.length - 1] : null;
}
export function useGetScrollY(chatId: string): number {
  const { chats } = useContext(ChatContext);
  return chats[chatId]?.lastScrollY || 0;
}

export function useSetInitialized() {
  const { chats, setChats } = useContext(ChatContext);

  return function (chatId: string, initialized: boolean) {
    const chat = chats[chatId];
    if (chat) {
      setChats((prevChats) => ({
        ...prevChats,
        [chatId]: {
          ...prevChats[chatId],
          initialized,
        },
      }));
    }
  };
}

export function useGetInitialized(chatId: string) {
  const { chats } = useContext(ChatContext);
  const chat = chats[chatId];
  return chat?.initialized || false;
}
