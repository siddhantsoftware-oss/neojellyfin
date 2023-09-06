import { useQuery } from "react-query";
import { apiServerUrl } from "../_main";

function Index() {
  const { data, isLoading } = useQuery("hello", async () =>
    fetch(`${apiServerUrl}/hello`, {
      headers: { Accept: "application/json" },
    }).then((res) => res.text())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{data}</div>;
}

export default Index;
