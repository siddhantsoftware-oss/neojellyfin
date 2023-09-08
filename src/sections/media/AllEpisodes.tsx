import React from "react";
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
      }/Episodes?seasonId=${media.Id}`,
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
            to={"/collection/media/" + episode.Id}
            key={key}
            className="flex hover:scale-105 transition flex-col gap-y-1"
          >
            <Image
              Ratio={16/9}
              src={`${localStorage.getItem("address")}/Items/${
                episode.Id
              }/Images/Primary`}
              width={300}
              className="rounded-md"
            />
            <div className="text-xl font-semibold text-center">
              {episode.Name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllEpisodes;
