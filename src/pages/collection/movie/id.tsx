import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getAuth } from "../../root";
import Loading from "../../../components/Loading";

interface Movie {
  Name: string;
  OriginalTitle: string;
  isHD: boolean;
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

  const { data: movie, isLoading } = useQuery("movieData", () =>
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
          <div className="text-2xl font-semibold">{movie.ProductionYear}</div>
        </div>
        <div className="text-4xl font-semibold">{movie.Name}</div>
      </div>
    </div>
  );
}

export default MoviePage;
