import { useQuery } from "react-query";
import { getAuth } from "../pages/root";
import Marquee from "react-fast-marquee";

interface MediaType {
  Name: string;
  OriginalTitle: string;
  Id: string;
  PlaylistItemId: string;
  SortName: "string";
  SeriesId: string;
  SeriesName: string;
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
      <Marquee speed={40} pauseOnHover>
        {data?.map((media, idx) => (
          <div
            key={idx}
            className="shrink-0 group/cover relative transition overflow-clip mx-2 rounded-md"
          >
            <div className="absolute top-0 left-0 h-full w-full transition group-hover/cover:bg-black/40 group-hover/cover:backdrop-blur-sm ">
              <div className="group-hover/cover:visible flex flex-col invisible transition p-5">
                <div>
                  <img
                    id={media.SeriesId ?? media.Id}
                    src={`${localStorage.getItem("address")}/Items/${
                      media.SeriesId ?? media.Id
                    }/Images/Logo`}
                    className="w-[200px] h-fit "
                    alt={"Movie poster for " + media.Name}
                    onError={() => {
                      const element = document.getElementById(
                        media.SeriesId ?? media.Id
                      );
                      element?.parentNode?.removeChild(element);
                    }}
                  />
                </div>
              </div>
            </div>
            <img
              width={600}
              className="h-fit "
              src={`${localStorage.getItem("address")}/Items/${
                media.SeriesId ?? media.Id
              }/Images/Backdrop`}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
}

export default RecentlyAdded;
