import { useQuery } from "react-query";
import { getAuth } from "../pages/root";
import { MediaType } from "./RecentlyAdded";
import { Link } from "react-router-dom";
import Image from "../components/Image";


function ResumeWatching() {
  const { data, isLoading } = useQuery("resume", () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Items/Resume?Limit=12&Recursive=true`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result.Items as MediaType[])
  );

  return (
    <div className="px-10 flex flex-col gap-y-3">
      <div className="text-3xl font-semibold">Continue Watching</div>
      <div className="flex gap-x-5 overflow-x-scroll pb-5">
        {isLoading ? <div className="aspect-[16/9] min-w-[400px]"></div> : null}
        {data?.map((media, key) => (
          <ResumeMediaTab key={key} media={media} />
        ))}
      </div>
    </div>
  );
}

const ResumeMediaTab = ({ media }: { media: MediaType }) => {
  return (
    <div className="shrink-0 group/cover">
      <div className="relative aspect-[16/9] min-w-[400px]">
        <Image
          Ratio={16 / 9}
          src={`${localStorage.getItem("address")}/Items/${media.Id}/Images/${
            media.SeriesId ? "Primary" : "Backdrop"
          }`}
          alt=""
          className="w-[400px] rounded-md overflow-clip aspect-[16/9]"
        />
        <div
          style={{
            width: media.UserData.PlayedPercentage + "%",
          }}
          className="absolute h-[5px] z-20 bg-primary bottom-0 left-0 rounded-bl-md"
        ></div>
        <div className="absolute h-[5px] z-10 bg-secondary/80 w-full bottom-0 left-0 rounded-b-md"></div>
        <div className="absolute z-30 invisible group-hover/cover:visible transition top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm flex place-items-center justify-center">
          <Link
            to={
              "/playback/" +
              media.Id +
              "?resume=" +
              media.UserData.PlaybackPositionTicks
            }
            className="rounded-full bg-primary p-3 hover:opacity-80 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeWatching;
