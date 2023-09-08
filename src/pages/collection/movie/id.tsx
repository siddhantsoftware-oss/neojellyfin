import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { getAuth } from "../../root";
import Loading from "../../../components/Loading";

interface Movie {
  Name: string;
  OriginalTitle: string;
  IsHD: boolean;
  Genres: string[];
  OfficialRating: string;
  ProductionYear: number;
  Tags: string[];
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
  const movieId = useLocation().pathname.replace("/collection/movie/", "");

  const { data: movie, isLoading } = useQuery(`${movieId}-data`, () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Items/${movieId}`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result as Movie)
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!movie) {
    return <div>Could not find what you requested</div>;
  }

  return (
    <div className=" relative">
      <div className="h-[200px]">
        <div className="relative">
          <img
            src={`${localStorage.getItem(
              "address"
            )}/Items/${movieId}/Images/Backdrop`}
            className="w-full overflow-hidden h-[400px] object-cover opacity-70 "
            alt=""
          />
          <div className="absolute bg-gradient-to-t from-background to-transparent bottom-0 left-0 w-full h-[20%]  "></div>
          <div className="absolute bg-gradient-to-b from-background to-transparent top-0 left-0 w-full h-[20%]  "></div>
        </div>
      </div>
      <div className="relative flex-col flex gap-y-5 z-20 px-10">
        <div className="flex items-end gap-x-5">
          <div>
            <img
              src={`${localStorage.getItem(
                "address"
              )}/Items/${movieId}/Images/Primary`}
              width={240}
              alt=""
              className="rounded-md aspect-[2/3] min-w-[240px]"
            />
          </div>
          <div className="flex flex-col gap-y-6">
            <div className="flex gap-x-5 items-end">
              <div className="text-2xl font-semibold">
                {movie.ProductionYear}
              </div>
              <div className="font-semibold">{movie.OfficialRating}</div>
              {movie.IsHD ? (
                <div className="bg-white text-black px-2 rounded-md font-bold py-0.5">
                  HD
                </div>
              ) : null}
            </div>
            <div>
              <Link
                to={`/playback/${movieId}`}
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
                {movie.UserData.PlaybackPositionTicks!==0?"Resume":"Play"}
              </Link>
            </div>
          </div>
        </div>
        <div className="text-4xl font-semibold">{movie.Name}</div>
        <div></div>
      </div>
    </div>
  );
}

export default MoviePage;
