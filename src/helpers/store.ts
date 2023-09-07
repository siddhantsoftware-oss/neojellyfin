import { create } from "zustand";

interface UseStoreTypes {
  userId: string | null;
  setUserId: (newUserId: string) => void;
}

const useStore = create<UseStoreTypes>((set) => ({
  userId: null,
  setUserId: (newUserId) =>
    set(() => ({
      userId: newUserId,
    })),
}));

export default useStore;
