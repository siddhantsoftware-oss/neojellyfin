import { useQuery } from "react-query";
import { getAuth } from "../pages/root";
import Marquee from "react-fast-marquee";

interface MediaType {
  Name: string;
  OriginalTitle: string;
  Id: string;
  PlaylistItemId: string;
  SortName: "string";
}

function RecentlyAdded() {
  const { data } = useQuery("recently-added", () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Items/Latest`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result as MediaType[])
  );

  return (
    <div className="flex py-10 flex-col gap-y-3">
      <Marquee speed={30} pauseOnHover>
        {data?.map((media, idx) => (
          <div
            key={idx}
            className="shrink-0 group/cover relative transition overflow-clip mx-2 rounded-md"
          >
            <div ></div>
            <div className="absolute top-0 left-0 h-full w-full transition group-hover/cover:bg-black/40 group-hover/cover:backdrop-blur-sm "></div>
            <img
              width={600}
              className="h-fit "
              src={`${localStorage.getItem("address")}/Items/${
                media.Id
              }/Images/Backdrop`}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
}

export default RecentlyAdded;
