import React from "react";
import { Media } from "../../pages/collection/media/id";
import { useQuery } from "react-query";
import { getAuth } from "../../pages/root";
import Image from "../../components/Image";
import { Link } from "react-router-dom";

function AllSeasons({ media }: { media: Media }) {
  const { data: seasons } = useQuery(media.Id, () =>
    fetch(
      `${localStorage.getItem("address")}/Shows/${
        media.Id
      }/Seasons?userId=${localStorage.getItem("userId")}`,
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
            Id: string;
            Name: string;
          }[]
      )
  );

  if (!seasons) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-5">
      <div className="text-3xl font-semibold">Seasons</div>
      <div className="flex flex-wrap gap-5">
        {seasons.map((season, key) => (
          <Link
            to={"/collection/media/" + season.Id}
            key={key}
            className="flex hover:scale-105 transition flex-col gap-y-1"
          >
            <Image
              Ratio={2 / 3}
              src={`${localStorage.getItem("address")}/Items/${
                season.Id
              }/Images/Primary`}
              width={210}
              className="rounded-md"
            />
            <div className="text-xl font-semibold text-center">
              {season.Name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllSeasons;
