import { useQuery } from "react-query";
import { apiServerUrl } from "../_main";
import Loading from "../components/Loading";
import Router from "../router";
import SetupWizard from "./SetupWizard";

function Index() {
  const { data: config, isLoading } = useQuery(
    "hello",
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

  return <Router />;
}

export default Index;
