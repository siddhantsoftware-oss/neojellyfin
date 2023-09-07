import { useQuery } from "react-query";
import { getAuth } from "../pages/root";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

interface MediaType {
  Name: string;
  OriginalTitle: string;
  Id: string;
  PlaylistItemId: string;
  SortName: "string";
  SeriesId: string;
  SeriesName: string;
  OfficialRating: string;
  PremiereDate: Date;
  hasSubtitles: boolean;
  Type: string;
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
              <div className="group-hover/cover:visible h-full flex flex-col justify-between invisible transition p-5">
                <div className="flex flex-col gap-y-5">
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
                  <div className="flex gap-x-2 flex-wrap">
                    <div className="bg-background px-2 rounded-md font-bold  w-fit">
                      {media.OfficialRating}
                    </div>
                    {media.hasSubtitles ? (
                      <div className="bg-background px-2 rounded-md font-bold  w-fit">
                        Subtitles
                      </div>
                    ) : null}
                    <div className="bg-background px-2 rounded-md font-bold  w-fit">
                      {new Date(media.PremiereDate).getFullYear()}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/collection/${media.Type.toLowerCase()}/${
                    media.SeriesId ?? media.Id
                  }`}
                  className="bg-primary hover:bg-blue-600 px-3 w-fit py-1 text-lg font-semibold rounded-md transition"
                >
                  View
                </Link>
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
