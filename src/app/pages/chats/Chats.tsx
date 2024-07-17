import React, { useContext, useEffect, useState } from "react";
import style from "./chats.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getActiveTheme } from "../../features/theme/themeSlice";
import { MdOutlineArchive, MdOutlineChat, MdOutlineHome } from "react-icons/md";
import dialogSlice, {
  selectAllDialogs,
  setDialogs,
} from "../../features/dialog/dialogSlice";
import { TelegramClientContext } from "../../App";
import { Dialogs } from "../../../api/telegram/dialogs";
import ConversationList from "../../components/conversation/ConversationList";
import { Outlet, useNavigate } from "react-router";

export function ChatDetail() {
  return <div>Chats</div>;
}

export default function Chats() {
  const theme = useSelector(getActiveTheme);
  const [activePage, setActive] = useState("home");
  const { client } = useContext(TelegramClientContext);
  const dialogs = useSelector(selectAllDialogs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function isActive(page: string) {
    return page === activePage;
  }

  useEffect(() => {
    (async function () {
      if (!dialogs.length) {
        const dialogClass = new Dialogs(client);
        const list = await dialogClass.get();

        dispatch(setDialogs(list.slice(0, 20)));
      }
    })().catch((err) => {
      console.log(err);
    });
  }, [dialogs.length, client, dispatch]);

  return (
    <div className={style["container"]}>
      <div
        className={style["chat-list"]}
        style={{
          borderRightWidth: 1,
          borderRightColor: theme.border,
        }}
      >
        <div
          className="w-full px-4 py-3 flex justify-center"
          style={{
            // borderBottomWidth: 1,
            // borderBottomColor: theme.border,

            height: 65,
          }}
        >
          <h1
            style={{ color: theme.primary }}
            className="font-bold flex gap-4 items-center text-2xl flex-1"
          >
            <MdOutlineChat className="text-3xl" /> Chats
          </h1>

          <div className="flex gap-1 items-center">
            <span
              onClick={() => setActive("home")}
              className={`opacity-50 cursor-pointer hover:opacity-80 p-1 rounded-full hover:text-[${theme.primary}]`}
            >
              <MdOutlineHome
                size={25}
                style={{
                  color: isActive("home") ? theme.secondary : theme.text,
                }}
              />
            </span>

            <span
              onClick={() => setActive("archive")}
              className={`opacity-50 cursor-pointer hover:opacity-80 p-1 rounded-full hover:text-[${theme.primary}]`}
            >
              <MdOutlineArchive
                size={25}
                style={{
                  color: isActive("archive") ? theme.secondary : theme.text,
                }}
              />
            </span>
          </div>
        </div>
        <ConversationList dialogs={dialogs} />
      </div>
      <div className="flex-1 flex">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
