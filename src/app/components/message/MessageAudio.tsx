import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "../../../api/telegram/message";
import { Api } from "telegram";
import { TelegramClientContext } from "../../App";
import style from "./message..module.css";
import { getActiveTheme } from "../../features/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { bytesToMegabytes, formatTimestamp, wait } from "../../../api/global";
import { MdClose, MdPause, MdPauseCircle, MdPlayCircle } from "react-icons/md";
import {
  addAudioThumb,
  selectThumbPhoto,
} from "../../features/messagePhoto/messagePhotoSlice";
// @ts-ignore
import bgBlurred from "../../../assets/bg/white-bg.jpg";
import {
  addAudio,
  getAudioState,
  getDownloadingPercent,
  getOneAudioSource,
  useDownloadAudio,
} from "../../features/audio/audioSlice";
import {
  useGetAudio,
  useGetPlayer,
  useSetAudio,
} from "../../contexts/AudioPlayerContext";
import CircleProgressBar from "../common/CircleProgressBar";

export interface MessageAudioProps {
  message: Message;
}

export default function MessageAudio({ message }: MessageAudioProps) {
  const [audioInfo, setAudioInfo] = useState<Api.Document>();
  const [mediaInfo, setMediaInfo] = useState<Api.DocumentAttributeAudio>();
  const { client } = useContext(TelegramClientContext);
  const src = useSelector(getOneAudioSource(audioInfo?.id?.toString()));
  const audioState = useSelector(getAudioState(audioInfo?.id?.toString()));
  const downloadAudio = useDownloadAudio(audioInfo);
  const [playing, setPlaying] = useState(false);
  const activeAudio = useGetAudio();
  const theme = useSelector(getActiveTheme);
  const setAudio = useSetAudio();
  const player = useGetPlayer();
  const dispatch = useDispatch();

  const percentage = useSelector(
    getDownloadingPercent(audioInfo?.id?.toString())
  );
  const audioThumb = useSelector(
    selectThumbPhoto(audioInfo?.id?.toString() || "")
  );

  useEffect(() => {
    const info = message.getAudioInfos();
    // @ts-ignore
    setMediaInfo(message.getMediaInfo("DocumentAttributeAudio"));
    setAudioInfo(info);
  }, [message]);

  useEffect(
    function () {
      if (audioInfo) {
        dispatch(
          addAudio({
            id: audioInfo.id.toString(),
          })
        );
      }
    },
    [audioInfo]
  );

  useEffect(
    function () {
      if (activeAudio) {
        if (activeAudio.file_id === audioInfo?.id?.toString()) {
          setPlaying(activeAudio.playing);
        } else {
          setPlaying(false);
        }
      }
    },
    [activeAudio]
  );

  useEffect(
    function () {
      if (audioInfo) {
        if (!audioThumb) {
          client
            .downloadFile(
              new Api.InputDocumentFileLocation({
                accessHash: audioInfo.accessHash,
                fileReference: audioInfo.fileReference,
                id: audioInfo.id,
                thumbSize: "m",
              })
            )
            .then(function (buffer) {
              if (typeof buffer !== "string") {
                const blob = new Blob([buffer]);
                const url = URL.createObjectURL(blob);
                dispatch(
                  addAudioThumb({
                    photoId: audioInfo.id.toString(),
                    url,
                  })
                );
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      }
    },
    [audioInfo]
  );

  async function play() {
    if (player && player.src) {
      if (player.src !== src) {
        setAudio({
          file_id: audioInfo.id.toString(),
          source: src,
        });
      }

      await wait(500);
      player.play();
    }
  }

  return audioInfo && mediaInfo ? (
    <div className={style["audio-msg"]}>
      <div className={style["audio-thumb"]}>
        <img src={audioThumb || bgBlurred} style={{ zIndex: 1 }} />

        {audioState === "Initialized" || audioState === "Done" ? (
          !playing ? (
            <MdPlayCircle
              size={35}
              color={"white"}
              className="opacity-70"
              style={{ zIndex: 99 }}
              onClick={audioState === "Done" ? play : downloadAudio}
            />
          ) : (
            <MdPauseCircle
              size={35}
              color={"white"}
              className="opacity-70"
              style={{ zIndex: 99 }}
              onClick={function () {
                player.pause();
              }}
            />
          )
        ) : (
          <>
            <CircleProgressBar
              colour={theme.primary}
              percentage={percentage}
              size={30}
              strokeWidth={2.5}
              fontSize={"5px"}
            />
            <MdClose size={17} className="absolute text-white"></MdClose>
          </>
        )}
      </div>
      <div className="flex-1 flex items-center opacity-70">
        <div className="flex flex-col h-full justify-center flex-1">
          <p>{mediaInfo.title}</p>
          <p
            style={{
              color: theme.secondary,
            }}
            className="text-sm"
          >
            {mediaInfo.performer}
          </p>
        </div>
        <div className="h-full flex flex-col justify-center">
          <p className="text-xs opacity-60 mb-2">
            {formatTimestamp(mediaInfo.duration)}
          </p>
          <p className="text-xs opacity-60">
            {bytesToMegabytes(audioInfo.size.toJSNumber())}MB
          </p>
        </div>
      </div>
    </div>
  ) : null;
}
