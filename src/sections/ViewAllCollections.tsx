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
    <div className="md:px-10 px-3 flex flex-col gap-y-3">
      <div className="md:text-3xl text-2xl font-semibold">Libraries</div>
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
              to={`/collection/${item.SortName}/all/${item.Id}`}
              className="bg-white shrink-0 md:text-xl text-lg font-semibold text-black hover:opacity-70 transition md:w-[180px] w-[30vw] flex justify-center place-items-center rounded-md md:h-[80px] h-[8vh]"
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
