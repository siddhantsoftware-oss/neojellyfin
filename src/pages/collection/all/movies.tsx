import { useQuery } from "react-query";
import { MediaType } from "../../../sections/RecentlyAdded";
import { getAuth } from "../../root";
import { VerticalCover } from "./shows";
import { useLocation } from "react-router-dom";

interface ItemType {
  Name: string;
  Id: string;
}

function ViewMovieLibrary() {
  const collectionId = useLocation().pathname.replace(
    "/collection/movies/all/",
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
      )}/Items?IncludeItemTypes=Movie&Recursive=true`,
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
      <div className="text-5xl  pb-8 pt-5 font-semibold ">
        {collection.Name}
      </div>
      <div className="flex flex-wrap gap-5">
        {items.map((item, key) => (
          <VerticalCover key={key} media={item} />
        ))}
      </div>
    </div>
  );
}

export default ViewMovieLibrary;
