import { create } from "zustand";

interface PlayerInterface {
    playing: boolean
    setPlaying: (newVal: boolean) => void
}

const usePlayer = create<PlayerInterface>((set)=>({
    playing: true,
    setPlaying: (playing) => set(()=>({
        playing: playing
    })),
    currentMaxBitrate: 80000
}))

export default usePlayer