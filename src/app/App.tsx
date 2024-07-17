import React, { useRef, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

import { API_HASH, API_ID } from "../api/global";
import * as telegram from "telegram";

import Main from "./pages/Main/Main";
import { AudioPlayerContext } from "./contexts/AudioPlayerContext";

export interface TelegramClientContextType {
  clientConnected: boolean;
  client?: telegram.TelegramClient;
  setClientConnected?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TelegramClientContext =
  React.createContext<TelegramClientContextType>({
    clientConnected: false,
  });
function App() {
  const client = new telegram.TelegramClient(
    new telegram.sessions.StoreSession("telewave-session"),
    API_ID,
    API_HASH,
    {
      connectionRetries: 5,
    }
  );
  const [clientConnected, setClientConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement>();
  const [audio, setAudio] = useState({
    file_id: "",
    source: "",
    playing: false,
    current: 0,
  });

  return (
    <Provider store={store}>
      <TelegramClientContext.Provider
        value={{
          clientConnected,
          setClientConnected,
          client,
        }}
      >
        <AudioPlayerContext.Provider
          value={{
            player: audioRef.current,
            audio,
            setAudio,
          }}
        >
          <Main />
          <audio
            src={audio.source}
            ref={audioRef}
            className="hidden"
            onPause={function () {
              setAudio({
                ...audio,
                playing: false,
              });
            }}
            onPlay={function () {
              setAudio({
                ...audio,
                playing: true,
              });
            }}
            onPlaying={function (e) {
              const secondsPlayed = e.currentTarget.currentTime;
              setAudio({
                ...audio,
                current: secondsPlayed,
              });
            }}
          />
        </AudioPlayerContext.Provider>
      </TelegramClientContext.Provider>
    </Provider>
  );
}

export default App;
