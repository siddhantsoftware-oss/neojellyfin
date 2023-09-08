import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { getAuth } from "../../root";
import Loading from "../../../components/Loading";
import Image from "../../../components/Image";
import AllSeasons from "../../../sections/media/AllSeasons";
import AllEpisodes from "../../../sections/media/AllEpisodes";

export interface Media {
  ParentId: string
  Id: string;
  Name: string;
  OriginalTitle: string;
  IsHD: boolean;
  Genres: string[];
  OfficialRating: string;
  ProductionYear: number;
  Tags: string[];
  Type: string;
  UserData: {
    IsFavorite: boolean;
    Key: string;
    LastPlayedDate: Date;
    Played: boolean;
    PlaybackPositionTicks: number;
    PlayCount: number;
  };
  Studios: {
    Name: string;
    Id: string;
  }[];
  RunTimeTicks: number;
  People: {
    Name: string;
    Id: string;
    Role: string;
    Type: string;
  }[];
}

function MoviePage() {
  const mediaId = useLocation().pathname.replace("/collection/media/", "");

  const { data: media, isLoading } = useQuery(`${mediaId}-data`, () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Items/${mediaId}`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result as Media)
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!media) {
    return <div>Could not find what you requested</div>;
  }

  return (
    <div className=" relative">
      <div className="h-[200px]">
        <div className="relative">
          <Image
            Ratio={16 / 9}
            src={`${localStorage.getItem(
              "address"
            )}/Items/${mediaId}/Images/Backdrop`}
            className="w-full overflow-hidden h-[400px] object-cover opacity-70 "
            alt=""
          />
          <div className="absolute bg-gradient-to-t from-background to-transparent bottom-0 left-0 w-full h-[20%]  "></div>
          <div className="absolute bg-gradient-to-b from-background to-transparent top-0 left-0 w-full h-[20%]  "></div>
        </div>
      </div>
      <div className="relative flex-col flex gap-y-5 z-20 px-10">
        <div className="flex items-end gap-x-5">
          <div className="drop-shadow-2xl">
            <Image
              Ratio={2 / 3}
              src={`${localStorage.getItem(
                "address"
              )}/Items/${mediaId}/Images/Primary`}
              width={240}
              alt=""
              className="rounded-md aspect-[2/3] min-w-[240px]"
            />
          </div>
          <div className="flex flex-col gap-y-6">
            <div className="text-4xl font-semibold">{media.Name}</div>
            <div className="flex gap-x-5 items-end">
              <div className="text-2xl font-semibold">
                {media.ProductionYear}
              </div>
              <div className="font-semibold">{media.OfficialRating}</div>
              {media.IsHD ? (
                <div className="bg-white text-black px-2 rounded-md font-bold py-0.5">
                  HD
                </div>
              ) : null}
            </div>
            {media.Type === "Movie" || media.Type === "Episode" ? (
              <div>
                <Link
                  to={`/playback/${mediaId}`}
                  className="bg-white transition hover:opacity-70 flex items-center gap-x-2 px-2 py-1 rounded-md text-lg font-semibold text-black w-fit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {media.UserData.PlaybackPositionTicks !== 0
                    ? "Resume"
                    : "Play"}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        {media.Type === "Series" ? <AllSeasons media={media} /> : null}
        {media.Type === "Season" ? <AllEpisodes media={media} /> : null}
        <div className="">
          <div className="text-3xl font-semibold">Cast</div>
          <div className="flex gap-x-4  pb-10 pt-4 overflow-x-scroll ">
            {media.People.map(
              (
                people: {
                  Name: string;
                  Id: string;
                  Role: string;
                },
                key: number
              ) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-between shrink-0 text-center "
                >
                  <div className="flex flex-col items-center max-w-[150px] gap-y-2 ">
                    <div className="relative w-[150px] aspect-square">
                      <Image
                        Ratio={1}
                        id={people.Id + "_img"}
                        width={150}
                        src={`${localStorage.getItem("address")}/Items/${
                          people.Id
                        }/Images/Primary`}
                        onError={() => {
                          const element = document.getElementById(
                            people.Id + "_img"
                          );
                          element?.parentNode?.removeChild(element);
                        }}
                        className="rounded-full aspect-square absolute top-0 left-0 z-20 object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-accent   h-full rounded-full aspect-square"></div>
                    </div>
                    <div className="font-semibold text-sm">{people.Name}</div>
                  </div>
                  <div className="text-xs opacity-80">{people.Role}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
