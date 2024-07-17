import React, { useContext, useEffect, useState } from "react";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { TelegramClientContext } from "../../App";
import MainLoading from "../../components/common/MainLoading";
import Login from "../login/Login";
import NotConnected from "../../components/common/NotConnected";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIsLoggedIn,
  setLoggedIn,
  setUser,
} from "../../features/auth/authSlice";
import Dashboard from "../Dashboard/Dashboard";
import TopBar from "../../components/topbar/TopBar";
import { getUserProfile, isElectron } from "../../../api/global";
import { ChatContext } from "../../contexts/ChatContext";
import * as Telegram from "telegram";

const Router = isElectron() ? HashRouter : BrowserRouter;
export default function Main() {
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnecttionError] = useState("");
  const [chats, setChats] = useState({});
  const is_electron = isElectron();
  const { client, clientConnected, setClientConnected } = useContext(
    TelegramClientContext
  );
  const isLoggedIn = useSelector(checkIsLoggedIn);

  const dispatch = useDispatch();

  useEffect(function () {
    setConnecting(true);
    client
      .connect()
      .then(async function (connected) {
        const loggedIn = await client.isUserAuthorized();

        console.log("logged in ?");

        if (loggedIn) {
          dispatch(setLoggedIn(true));

          const {
            id,
            firstName,
            lastName,
            username,
            phone,
            self,
            contact,
            mutualContact,
            deleted,
            bot,
            verified,
            restricted,
          } = await client.getMe();
          const serializableUser = {
            id: id.toString(),
            firstName,
            lastName,
            username,
            phone,
            self,
            contact,
            mutualContact,
            deleted,
            bot,
            verified,
            restricted,

            // getting user profile
            photo: await getUserProfile(client),
          };
          dispatch(setUser(serializableUser));
        }
        setClientConnected(connected);
      })
      .catch(function (err) {
        console.log("error connecting to server", err);
        setConnecttionError(err);
      })
      .finally(function () {
        setConnecting(false);
      });
  }, []);

  return connecting ? (
    <MainLoading />
  ) : clientConnected ? (
    <ChatContext.Provider
      value={{
        chats: chats,
        setChats,
      }}
    >
      <Router>
        <div className="w-screen h-screen">
          {is_electron ? <TopBar></TopBar> : null}
          <div
            style={{
              height: is_electron ? "calc(100vh - 30px)" : "100vh",
            }}
          >
            <Routes>
              <Route path="*" Component={Dashboard} />
              <Route path={isLoggedIn ? "/login" : "/"} Component={Login} />
              {/* Add more routes here */}
            </Routes>
          </div>
        </div>
      </Router>
    </ChatContext.Provider>
  ) : (
    <NotConnected />
  );
}
