import React from "react";
import MessageAPI from "../../../api/telegram/message";
import Message from "./Message";

export interface MessageListProps {
  messages: MessageAPI[];
}
export default function MessageList(props: MessageListProps) {
  return (
    <>
      {props.messages.map((message, key) => (
        <Message
          message={message}
          prev={props.messages[key - 1]}
          next={props.messages[key + 1]}
          key={key}
        />
      ))}
    </>
  );
}
