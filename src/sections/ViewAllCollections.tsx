import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getAuth } from "../pages/root";

function ViewAllCollections() {
  const { data } = useQuery("library", () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Views`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result.Items)
  );

  return (
    <div className="px-10 flex flex-col gap-y-3">
      <div className="text-3xl font-semibold">Libraries</div>
      <div className="flex gap-x-5 flex-wrap">
        {data?.map(
          (
            item: {
              SortName: string;
              Id: string;
              Name: string;
            },
            idx: number
          ) => (
            <Link
              key={idx}
              to={`/collections/${item.SortName}/${item.Id}`}
              className="bg-white shrink-0 text-xl font-semibold text-black hover:opacity-70 transition w-[180px] flex justify-center place-items-center rounded-md h-[80px]"
            >
              {item.Name}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default ViewAllCollections;
