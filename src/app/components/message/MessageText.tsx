import React, { useEffect, useRef, useState } from "react";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "./message..module.css";
import MessageAPI from "../../../api/telegram/message";
import { useSelector } from "react-redux";
import { getActiveMode, getActiveTheme } from "../../features/theme/themeSlice";
export function MessageText({ message }: { message: MessageAPI }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const activeThemeMode = useSelector(getActiveMode);
  const [text, setText] = useState<(JSX.Element | string)[]>([]);
  const processText = (text: string, idk: number) => {
    return text.split("").map((char, idx) => {
      if (char === " ") return <span key={idx * 34 * idk}>&nbsp;</span>;
      if (char === "\t")
        return <span key={idx * 34 * idk}>&nbsp;&nbsp;&nbsp;&nbsp;</span>;
      if (char === "\n") return <br key={idx * 34 * idk} className="my-2" />;
      return char;
    });
  };
  const theme = useSelector(getActiveTheme);
  useEffect(() => {
    const entities = message.getMessage().entities;
    const messageText = message.getText();

    if (entities && messageText) {
      let lastIndex = 0;
      const parts: (JSX.Element | string)[] = [];

      entities.forEach((entity, index) => {
        const from = entity.offset;
        const to = entity.length + entity.offset;

        if (lastIndex < from) {
          parts.push(messageText.slice(lastIndex, from));
        }
        const entityText = messageText.slice(from, to);
        let formattedText: JSX.Element;

        switch (entity.className) {
          case "MessageEntityBold":
            formattedText = (
              <strong key={index}>{processText(entityText, 67)}</strong>
            );
            break;
          case "MessageEntityItalic":
            formattedText = <em key={index}>{processText(entityText, 56)}</em>;
            break;
          case "MessageEntityUnderline":
            formattedText = (
              <span key={index} className="underline opacity-80">
                {processText(entityText, 43)}
              </span>
            );
            break;
          case "MessageEntityCode":
            formattedText = (
              <code key={index}>{processText(entityText, 75)}</code>
            );
            break;
          case "MessageEntityPre":
            formattedText = (
              <SyntaxHighlighter
                customStyle={{
                  margin: 0,
                  padding: 2,
                  paddingLeft: 5,
                  paddingRight: 5,

                  userSelect: "contain",
                }}
                language={entity.language}
                style={oneDark}
                showInlineLineNumbers={true}
                key={index}
              >
                {entityText}
              </SyntaxHighlighter>
            );
            break;
          case "MessageEntityUrl":
            formattedText = (
              <a
                href={entityText}
                key={index}
                className="text-blue-400 underline"
              >
                {processText(entityText, 29)}
              </a>
            );
            break;
          case "MessageEntityEmail":
            formattedText = (
              <a
                href={`mailto:${entityText}`}
                key={index}
                className="text-blue-400 underline"
              >
                {processText(entityText, 96)}
              </a>
            );
            break;
          case "MessageEntityMention":
            formattedText = (
              <span
                key={index}
                className="text-blue-400 cursor-pointer hover:underline"
              >
                {entityText}
              </span>
            );
            break;
          case "MessageEntityHashtag":
            formattedText = (
              <span
                key={index}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                {entityText}
              </span>
            );
            break;
          case "MessageEntityBotCommand":
            formattedText = (
              <span
                key={index}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                {entityText}
              </span>
            );
            break;
          case "MessageEntityBlockquote":
            formattedText = (
              <blockquote
                key={index}
                className="border-l-4 border-gray-300 pl-2 py-2 italic my-2 rounded-s text-opacity-50"
                style={{
                  background: theme.secondary + "10",
                }}
              >
                {processText(entityText, 48)}
              </blockquote>
            );
            break;
          default:
            formattedText = (
              <span key={index} className="opacity-70">
                {processText(entityText, 21)}
              </span>
            );
            break;
        }

        parts.push(formattedText);
        lastIndex = to;
      });

      if (lastIndex < messageText.length) {
        parts.push(messageText.slice(lastIndex));
      }

      setText(parts);
    } else {
      setText([
        <span className="opacity-80" key={85454}>
          {messageText}
        </span>,
      ]);
    }
  }, [message]);

  return (
    <div
      style={{
        userSelect: "text",
        cursor: "text",
        wordBreak: "break-word",
        color: activeThemeMode === "dark" ? "white" : "black",
      }}
      ref={textRef}
      className="p-1"
    >
      {text}
    </div>
  );
}
