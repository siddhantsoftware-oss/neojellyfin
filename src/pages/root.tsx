import { useQuery } from "react-query";
import { apiServerUrl } from "../_main";
import Loading from "../components/Loading";
import SetupWizard from "./SetupWizard";
import AppRouter from "../router";
import useStore from "../helpers/store";

function Root() {
  const [setUserId, setDeviceId] = useStore((state) => [
    state.setUserId,
    state.setDeviceId,
  ]);

  useQuery("userId", () =>
    fetch(`${apiServerUrl}/user`, {
      credentials: "include",
    }).then((res) =>
      res.json().then((result) => {
        if (res.ok) {
          setUserId(result.data);
        }
      })
    )
  );
  useQuery("deviceId", () =>
    fetch(`${apiServerUrl}/config/deviceId`, {
      credentials: "include",
    }).then((res) =>
      res.text().then((result) => {
        if (res.ok) {
          setDeviceId(result);
        }
      })
    )
  );

  const { data: config, isLoading } = useQuery(
    "config",
    async () =>
      fetch(`${apiServerUrl}/config`, {
        headers: { Accept: "application/json" },
        credentials: "include",
      }),
    {
      retry: false,
    }
  );

  if (config && !config.ok) {
    return <SetupWizard />;
  }

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return <AppRouter />;
}

export default Root;
