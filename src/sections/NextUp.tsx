import { useQuery } from "react-query";
import { getAuth } from "../pages/root";
import { MediaType } from "./RecentlyAdded";
import { MediaTab } from "./ResumeWatching";

function NextUpMedia() {
  const { data: items } = useQuery("NextUp", () =>
    fetch(
      `${localStorage.getItem(
        "address"
      )}/Shows/NextUp?Limit=24&UserId=${localStorage.getItem(
        "userId"
      )}&EnableRewatching=false`,
      {
        headers: {
          Authorization: getAuth(`${localStorage.getItem("AccessToken")}`),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result.Items as MediaType[])
  );

  return (
    <div className="px-10 flex flex-col gap-y-3">
      <div className="text-3xl font-semibold">Next Up</div>
      <div className="flex gap-x-5 overflow-x-scroll pb-5">
        {items?.map((item, key) => (
          <MediaTab key={key} media={item} />
        ))}
      </div>
    </div>
  );
}

export default NextUpMedia;
