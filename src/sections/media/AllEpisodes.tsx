import { Media } from "../../pages/collection/media/id";
import { useQuery } from "react-query";
import { getAuth } from "../../pages/root";
import Image from "../../components/Image";
import { Link } from "react-router-dom";

function AllEpisodes({ media }: { media: Media }) {
  const { data: episodes } = useQuery(media.Id, () =>
    fetch(
      `${localStorage.getItem("address")}/Shows/${
        media.ParentId
      }/Episodes?seasonId=${media.Id}&userId=${localStorage.getItem("userId")}`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) =>
          result.Items as {
            Name: string;
            Id: string;
            UserData: {
              PlaybackPositionTicks: number;
            };
          }[]
      )
  );

  if (!episodes) {
    return <div>No episodes found</div>;
  }

  return (
    <div className="flex flex-col gap-y-5">
      <div className="text-3xl font-semibold">Episodes</div>
      <div className="flex flex-wrap gap-5">
        {episodes.map((episode, key) => (
          <Link
            to={
              "/playback/" +
              episode.Id +
              "?resume=" +
              episode.UserData.PlaybackPositionTicks
            }
            key={key}
            className="flex hover:scale-105 transition group/cover flex-col  "
          >
            <div className="relative">
              <div className="absolute invisible flex place-items-center justify-center rounded-md top-0 left-0 z-20 bg-black/60 group-hover/cover:visible  transition backdrop-blur-sm w-full h-full">
                <div className="bg-primary p-3 transition rounded-full">
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
                </div>
              </div>
              <Image
                Ratio={16 / 9}
                src={`${localStorage.getItem("address")}/Items/${
                  episode.Id
                }/Images/Primary`}
                width={300}
                className="rounded-md"
              />
            </div>
            <div className="text-center text-lg font-bold">
              Episode {key + 1}
            </div>
            <div className="text-sm font-semibold text-center">
              {episode.Name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllEpisodes;
