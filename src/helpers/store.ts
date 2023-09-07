import { create } from "zustand";

interface UseStoreTypes {
  // getters:
  userId: string | null;
  deviceId: string | null;
  // setters:
  setUserId: (newUserId: string) => void;
  setDeviceId: (newDeviceId: string) => void;
}

const useStore = create<UseStoreTypes>((set) => ({
  userId: null,
  deviceId: null,
  setUserId: (newUserId) =>
    set(() => ({
      userId: newUserId,
    })),
  setDeviceId: (newDeviceId) => set(() => ({ deviceId: newDeviceId })),
}));

export default useStore;
