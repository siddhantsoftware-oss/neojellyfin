import { QueryClient } from "react-query";
import { getAuth } from "../../pages/root";

async function logUserIn(
  username: string,
  password: string,
  address: string,
  queryClient: QueryClient
) {
  const res = await fetch(`${address}/Users/AuthenticateByName`, {
    method: "POST",
    headers: {
      Authorization: getAuth(""),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Username: username,
      Pw: password,
    }),
  });
  if (!res.ok) {
    throw Error("Username and password is incorrect");
  }
  const data = await res.json();
  localStorage.setItem("AccessToken", data.AccessToken);
  localStorage.setItem("userId", data.User.Id);
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
  localStorage.setItem("sessionId", data.SessionInfo.Id);
  queryClient.invalidateQueries("userId");
  return data;
}

export default logUserIn;
