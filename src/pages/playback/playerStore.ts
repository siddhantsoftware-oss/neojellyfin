import { create } from "zustand";

interface PlayerInterface {
    playing: boolean
    setPlaying: () => void
}

const usePlayer = create<PlayerInterface>((set)=>({
    playing: true,
    setPlaying: () => set(state=>({
        playing: !state.playing
    }))
}))

export default usePlayer