import { useQuery } from "react-query";
import { apiServerUrl } from "../_main";
import Loading from "../components/Loading";
import SetupWizard from "./SetupWizard";
import AppRouter from "../router";

function Root() {
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
