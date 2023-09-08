import { Jellyfin } from "@jellyfin/sdk";
import { getDeviceId } from "../sdk/server";

export const jellyfin = new Jellyfin({
  clientInfo: {
    name: "NeoJellyfin",
    version: "1.0.0",
  },
  deviceInfo: {
    id: getDeviceId(),
    name: "NeoPlayer",
  },
});

export const api = (localStorage: Storage) =>
  jellyfin.createApi(localStorage.getItem("address") ?? "");


