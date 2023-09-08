import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { getAuth } from "../../root";
import { MediaType } from "../../../sections/RecentlyAdded";

interface ItemType {
    Name: string;
    Id: string;
  }

function AllShowsList() {
  const collectionId = useLocation().pathname.replace(
    "/collection/shows/all/",
    ""
  );

  const { data: collection } = useQuery(collectionId + "_all", () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Items/${collectionId}`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result as ItemType)
  );

  const { data: items } = useQuery(collectionId + "_items", () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Items?IncludeItemTypes=Series&Recursive=true`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result.Items as MediaType[])
  );

  if (!collection || !items) {
    return <div>Could not find collection</div>;
  }

  return (
    <div className="px-10 flex flex-col gap-y-5">
      <div className="text-4xl font-semibold">{collection.Name}</div>
      <div className="flex flex-wrap gap-5">
        {items.map((item, key) => (
          <VerticalCover key={key} media={item} />
        ))}
      </div>
    </div>
  );
}

export const VerticalCover = ({ media }: { media: MediaType }) => {
  return (
    <Link
      to={`/collection/media/${media.Id}`}
      className="hover:scale-105 hover:opacity-80 transition"
    >
      <img
        alt={media.Name}
        src={`${localStorage.getItem("address")}/Items/${
          media.SeriesId ?? media.Id
        }/Images/Primary`}
        width={140}
        className="rounded-md"
      />
    </Link>
  );
};

export default AllShowsList;
