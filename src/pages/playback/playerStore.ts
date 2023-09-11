import { create } from "zustand";

interface PlayerInterface {
  playing: boolean;
  setPlaying: (newVal: boolean) => void;
  audioStreamIndex: number;
  subtitleStreamIndex: number;
  setAudioStreamIndex: (newIndex: number) => void;
  setSubtitleStreamIndex: (newIndex: number) => void;
}

const usePlayer = create<PlayerInterface>((set) => ({
  playing: true,
  setPlaying: (playing) =>
    set(() => ({
      playing: playing,
    })),
  currentMaxBitrate: 80000,
  audioStreamIndex: 0,
  subtitleStreamIndex: 0,
  setAudioStreamIndex: (newIndex) => set(()=>({
    audioStreamIndex: newIndex
  })),
  setSubtitleStreamIndex: (newIndex) => set(()=>({
    subtitleStreamIndex: newIndex
  })),
}));

export default usePlayer;
