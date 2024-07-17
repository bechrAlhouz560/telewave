import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "telegram";
import { useContext } from "react";
import { TelegramClientContext } from "../../App";

type AudioState = "Done" | "Downloading" | "Initialized";
interface CounterState {
  audios: {
    [id: string]: {
      source?: string;
      size?: number;
      downloading?: number;
      state?: AudioState;
    };
  };
}

const initialState: CounterState = {
  audios: {},
};

export const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addAudio(state, action: PayloadAction<{ id: string; source?: string }>) {
      const payload = action.payload;

      const audio = state.audios[payload.id];
      if (!audio) {
        state.audios[payload.id] = {
          source: payload.source,
          state: "Initialized",
        };
      }
      return state;
    },

    setSource(state, action: PayloadAction<{ id: string; source?: string }>) {
      const payload = action.payload;

      const audio = state.audios[payload.id] || {};
      state.audios[payload.id] = {
        ...audio,
        source: payload.source,
      };
      return state;
    },
    setDownloading(
      state,
      action: PayloadAction<{ id: string; state: AudioState }>
    ) {
      const payload = action.payload;
      const audio = state.audios[payload.id] || {};
      state.audios[payload.id] = {
        ...audio,
        state: payload.state,
      };
      return state;
    },
    setPercentage(
      state,
      action: PayloadAction<{ id: string; size?: number; downloading?: number }>
    ) {
      const payload = action.payload;

      const audio = state.audios[payload.id] || {};
      state.audios[payload.id] = {
        ...audio,
        size: payload.size,
        downloading: payload.downloading,
      };
      return state;
    },
  },
});

export function getOneAudioSource(id: string) {
  return function (state: RootState) {
    const audio = state.audio.audios[id];
    return audio?.source;
  };
}

export function getAudioState(id: string) {
  return function (state: RootState) {
    const audio = state.audio.audios[id];
    return audio?.state;
  };
}

export function getDownloadingPercent(id: string) {
  return function (state: RootState) {
    const audio = state.audio.audios[id];
    if (audio) {
      const percent = (audio.downloading / audio.size) * 100;
      return percent;
    }

    return 0;
  };
}

export function useDownloadAudio(audioInfo?: Api.Document) {
  const src = useSelector(getOneAudioSource(audioInfo?.id?.toString()));

  const { client } = useContext(TelegramClientContext);
  const audioState = useSelector(getAudioState(audioInfo?.id?.toString()));
  const dispatch = useDispatch();
  return async function () {
    if (audioState === "Downloading" || !audioInfo || src) return;

    try {
      dispatch(
        setDownloading({
          id: audioInfo?.id?.toString(),
          state: "Downloading",
        })
      );
      const request = new Api.InputDocumentFileLocation({
        accessHash: audioInfo.accessHash,
        fileReference: audioInfo.fileReference,
        id: audioInfo.id,
        thumbSize: "l",
      });

      await client.connect();

      const audioBuffer = await client.downloadFile(request, {
        dcId: audioInfo.dcId,
        fileSize: audioInfo.size,

        progressCallback(downloaded, fullSize) {
          dispatch(
            setPercentage({
              id: audioInfo?.id?.toString(),
              downloading: downloaded.toJSNumber(),
              size: fullSize.toJSNumber(),
            })
          );
        },
      });

      const blob = new Blob([audioBuffer], { type: audioInfo.mimeType });
      const url = URL.createObjectURL(blob);
      dispatch(
        setSource({
          id: audioInfo.id.toString(),
          source: url,
        })
      );
      dispatch(
        setDownloading({
          id: audioInfo?.id?.toString(),
          state: "Done",
        })
      );
      
      
    } catch (error) {
      console.log(error);
      dispatch(
        setDownloading({
          id: audioInfo?.id?.toString(),
          state: "Initialized",
        })
      );
    }
  };
}
export const { addAudio, setDownloading, setPercentage, setSource } =
  audioSlice.actions;

export default audioSlice.reducer;
