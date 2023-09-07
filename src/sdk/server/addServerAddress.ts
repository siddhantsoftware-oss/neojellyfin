import isUrl from "is-url-http";

async function addServerAddress(serverAddress: string) {
  if (!isUrl(serverAddress)) {
    throw Error("Not an address");
  }
  const res = await fetch(`${serverAddress}/System/Info/Public`);
  if (!res.ok) {
    throw Error("Server address is not valid");
  } else {
    localStorage.setItem("address", serverAddress);
    return serverAddress;
  }
}

export default addServerAddress;
