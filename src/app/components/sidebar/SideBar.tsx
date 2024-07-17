import React, { useContext, useEffect, useState } from "react";

// @ts-ignore
import style from "./sidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveMode,
  getActiveTheme,
  selectActiveThemeName,
  selectAllThemeNames,
  setActiveTheme,
  setMode,
} from "../../features/theme/themeSlice";
// @ts-ignore
import userIcon from "../../../assets/icons/user.svg";
import { TelegramClientContext } from "../../App";
import { getUser } from "../../features/auth/authSlice";
import {
  MdBookmark,
  MdCall,
  MdChat,
  MdColorize,
  MdContactMail,
  MdContacts,
  MdGroup,
  MdSave,
  MdSettings,
  MdKeyboardDoubleArrowRight,
  MdCheck,
} from "react-icons/md";
import { useLocation, useNavigate, useNavigation } from "react-router";
import { animated, useSpring } from "@react-spring/web";
export function NavBtn({
  minimized,
  setActivePage,
  isActive,
  pathname,
  name,
  logo,
}: any) {
  const theme = useSelector(getActiveTheme);

  const darkModeActive = useSelector(getActiveMode);
  const navigate = useNavigate();
  return (
    <div
      className={
        style["nav-btn"] +
        " " +
        (darkModeActive === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")
      }
      style={{
        ...isActive(pathname),
        justifyContent: minimized ? "center" : null,
        paddingLeft: minimized ? 0 : undefined,
      }}
      onClick={() => {
        navigate(pathname);
        setActivePage(pathname);
      }}
    >
      <span
        style={{
          color: theme.text,
        }}
      >
        {logo}
      </span>
      {!minimized ? (
        <span
          style={{
            color: theme.text,
          }}
        >
          {name}
        </span>
      ) : null}
    </div>
  );
}

export function ThemeSelector() {
  const themes = useSelector(selectAllThemeNames);
  const activeTheme = useSelector(selectActiveThemeName);
  const activeMode = useSelector(getActiveMode);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  return (
    <div className="flex gap-3 justify-center w-full flex-wrap mt-2 px-3">
      {themes.map(function ({ color, name }, key) {
        return (
          <div
            key={key}
            className="rounded-full w-6 h-6  flex items-center justify-center cursor-pointer hover:opacity-60"
            style={{
              background: color,
            }}
            onClick={function () {
              dispatch(setActiveTheme(name));
            }}
          >
            {activeTheme === name ? <MdCheck size={13}></MdCheck> : null}
          </div>
        );
      })}
      <div
        className="rounded-full w-6 h-6  flex items-center justify-center cursor-pointer hover:opacity-60"
        style={{
          background: "black",
          border: "1px solid white",
        }}
        onClick={function () {
          dispatch(setMode("dark"));
        }}
      >
        {activeMode === "dark" ? (
          <MdCheck color="white" size={13}></MdCheck>
        ) : null}
      </div>

      <div
        className="rounded-full w-6 h-6  flex items-center justify-center cursor-pointer hover:opacity-60"
        style={{
          background: "white",
          border: "1px solid black",
        }}
        onClick={function () {
          dispatch(setMode("light"));
        }}
      >
        {activeMode === "light" ? (
          <MdCheck color="black" size={13}></MdCheck>
        ) : null}
      </div>
    </div>
  );
}

export function SwitchSidebarBtn({ minimizedMode, setMinimizedMode }: any) {
  const theme = useSelector(getActiveTheme);

  const [springs, api] = useSpring(() => ({
    from: { rotate: "180deg" },
  }));

  useEffect(() => {
    api.start({
      to: { rotate: !minimizedMode ? "180deg" : "0deg" },

      delay: 0,
      config: {
        duration: 100,
      },
    });
  }, [minimizedMode, api]);

  const handleClick = () => {
    setMinimizedMode(!minimizedMode);
  };

  const color = theme.primary.toLowerCase();
  return (
    <animated.span
      style={{
        color: theme.primary,
        ...springs,
      }}
      className={
        "ml-auto mr-5 mt-5 mb-3 opacity-60 hover:opacity-85 transition-all cursor-pointer  " +
        `hover:text-[${color}]`
      }
      onClick={handleClick}
    >
      <MdKeyboardDoubleArrowRight size={30} />
    </animated.span>
  );
}
export default function SideBar() {
  const theme = useSelector(getActiveTheme);
  const user = useSelector(getUser);
  const [minimizedMode, setMinimizedMode] = useState(false);

  const [activePage, setActivePage] = useState("");

  const location = useLocation();

  function isActive(text: string) {
    return activePage.startsWith(text)
      ? {
          borderLeftColor: theme.primary,
          borderLeftWidth: 3,
          color: theme.primary,
        }
      : {};
  }

  useEffect(
    function () {
      setActivePage(location.pathname);
    },
    [location.pathname]
  );
  return (
    <div
      className={style["container"]}
      style={{
        width: minimizedMode ? 70 : undefined,
        borderRightWidth: 1,
        borderRightColor: theme.border,
      }}
      //   style={{
      //     borderRightColor: theme.border,
      //     borderRightWidth: "1pt",
      //   }}
    >
      <SwitchSidebarBtn
        minimizedMode={minimizedMode}
        setMinimizedMode={setMinimizedMode}
      />
      <div
        className="pb-7 flex flex-col items-center "
        style={{
          paddingBottom: minimizedMode ? 10 : 0,
        }}
      >
        <div
          className={style["user-img"]}
          style={{
            background: theme.primary,
            width: minimizedMode ? 45 : null,
            height: minimizedMode ? 45 : null,
          }}
        >
          <img
            src={user.photo || userIcon}
            className="w-full absolute"
            alt=""
          />
        </div>

        {!minimizedMode ? (
          <>
            <span
              className="mt-3 "
              style={{
                color: theme.primary,
              }}
            >
              {user.username}
            </span>

            <p
              className=" text-sm opacity-70 mb-5"
              style={{
                color: theme.text,
              }}
            >
              {user.firstName} {user.lastName}
            </p>
          </>
        ) : null}
      </div>

      <div
        className={style["nav-options"]}
        style={{
          borderTopColor: theme.border,
        }}
      >
        <NavBtn
          isActive={isActive}
          logo={<MdChat size={20} />}
          minimized={minimizedMode}
          name={"Chats"}
          pathname={"/chats"}
          setActivePage={setActivePage}
        />

        <NavBtn
          isActive={isActive}
          logo={<MdGroup size={20} />}
          minimized={minimizedMode}
          name={"Groups"}
          pathname={"/groups"}
          setActivePage={setActivePage}
        />
        <NavBtn
          isActive={isActive}
          logo={<MdContacts size={20} />}
          minimized={minimizedMode}
          name={"Contacts"}
          pathname={"/contacts"}
          setActivePage={setActivePage}
        />
        <NavBtn
          isActive={isActive}
          logo={<MdBookmark size={20} />}
          minimized={minimizedMode}
          name={"Saved Messages"}
          pathname={"/savedMessages"}
          setActivePage={setActivePage}
        />
        <NavBtn
          isActive={isActive}
          logo={<MdSettings size={20} />}
          minimized={minimizedMode}
          name={"Settings"}
          pathname={"/settings"}
          setActivePage={setActivePage}
        />
      </div>

      <ThemeSelector />
    </div>
  );
}
