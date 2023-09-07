import { create } from "zustand";

interface UseStoreTypes {
  // getters:
  userId: string | null;
  deviceId: string | null;
  authorizationHeader: string;
  accessToken: string | null;
  // setters:
  setUserId: (newUserId: string) => void;
  setDeviceId: (newDeviceId: string) => void;
  setAuthorizationHeader: (newHeader: string) => void;
  setAccessToken: (newToken: string) => void;
}

const useStore = create<UseStoreTypes>((set) => ({
  userId: null,
  deviceId: null,
  authorizationHeader: "",
  accessToken: null,
  setUserId: (newUserId) =>
    set(() => ({
      userId: newUserId,
    })),
  setDeviceId: (newDeviceId) => set(() => ({ deviceId: newDeviceId })),
  setAuthorizationHeader: (newHeader) =>
    set(() => ({ authorizationHeader: newHeader })),
  setAccessToken: (token) => set(() => ({ accessToken: token })),
}));

export default useStore;
