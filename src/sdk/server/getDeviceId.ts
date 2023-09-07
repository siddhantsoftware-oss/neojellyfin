import { v4 as uuid } from "uuid";

function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = uuid();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}


export default getDeviceId