import React, { useContext } from "react";

export interface AudioPlayerContextType {
  player?: HTMLAudioElement;
  audio?: {
    file_id: string;
    source: string;

    playing: boolean;
    current: number;
  };

  setAudio?: React.Dispatch<
    React.SetStateAction<{
      file_id: string;
      source: string;
      playing?: boolean;
      current?: number;
    }>
  >;
}
export const AudioPlayerContext = React.createContext<AudioPlayerContextType>(
  {}
);

export function useSetAudio() {
  const { setAudio } = useContext(AudioPlayerContext);
  return setAudio;
}

export function useGetAudio() {
  const { audio } = useContext(AudioPlayerContext);
  return audio;
}

export function useGetPlayer() {
  const { player } = useContext(AudioPlayerContext);
  return player;
}
