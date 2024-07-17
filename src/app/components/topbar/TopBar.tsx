import React from "react";
import { useSelector } from "react-redux";
import { getActiveTheme } from "../../features/theme/themeSlice";
import {
  MdMinimize,
  MdOutlineClose,
  MdOutlineMinimize,
  MdWindow,
} from "react-icons/md";
import { FiMaximize2 } from "react-icons/fi";
// @ts-ignore
import logo from "../../../assets/logo-main-white.svg";
export default function TopBar() {
  const theme = useSelector(getActiveTheme);

  return (
    <div
      style={{
        height: 30,
        background: theme.primary,
      }}
      className="flex pl-2 items-center w-screen"
    >
      <img src={logo} width={20} alt="" />
      <div
        className="flex-1 h-full"
        style={{
          // @ts-ignore
          WebkitAppRegion: "drag",
        }}
      ></div>

      <div className="h-full flex items-center">
        <div
          className="px-5 flex items-center justify-center h-full hover:opacity-70 cursor-pointer"
          style={{
            background: theme.primary,
          }}
        >
          <MdOutlineMinimize size={17} className="text-white" />
        </div>
        <div
          className="px-5 flex items-center justify-center h-full hover:opacity-70 cursor-pointer"
          style={{
            background: theme.primary,
          }}
        >
          <FiMaximize2 size={17} className="text-white" />
        </div>
        <div className="px-5  flex items-center cursor-pointer justify-center hover:bg-red-500 h-full">
          <MdOutlineClose size={17} className="text-white" />
        </div>
      </div>
    </div>
  );
}
