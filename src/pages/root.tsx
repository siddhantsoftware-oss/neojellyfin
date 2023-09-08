/* eslint-disable react-refresh/only-export-components */
import SetupWizard from "./SetupWizard";
import AppRouter from "../router";
import { getDeviceId, logUserIn } from "../sdk/server";
import { useQuery, useQueryClient } from "react-query";
import Loading from "../components/Loading";

export const getAuth = (accessToken?: string) =>
  `MediaBrowser Client="NeoJellyfin", Device="NeoPlayer", DeviceId="${getDeviceId()}", Version="1.0.0", Token="${accessToken}"`;

function Root() {
  const query = useQueryClient();

  const { isLoading, isError } = useQuery(
    "userId",
    () =>
      logUserIn(
        localStorage.getItem("username") ?? "",
        localStorage.getItem("password") ?? "",
        localStorage.getItem("address") ?? "",
        query
      ),
    {
      retry: false,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <SetupWizard />;
  }

  return <AppRouter />;
}

export default Root;
