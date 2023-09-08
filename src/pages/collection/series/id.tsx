import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getAuth } from "../../root";
import Loading from "../../../components/Loading";

function SeriesPage() {
  const seriesId = useLocation().pathname.replace("/collection/series/", "");

  const { data: seriesInfo } = useQuery(seriesId + "_specific", () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Items/${seriesId}`,
      {
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result)
  );

  if (!seriesInfo) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-y-10">
      <div className="px-10 flex gap-x-5">
        <div className="shrink-0 col-span-1">
          <img
            src={`${localStorage.getItem(
              "address"
            )}/Items/${seriesId}/Images/Primary`}
            alt=""
            width={200}
            className="rounded-md aspect-[0.66667] object-cover h-full"
          />
        </div>
        <div className="flex flex-col  gap-y-5 ">
          <div>
            <div className="text-4xl font-bold">{seriesInfo.Name}</div>
            <div className="flex gap-x-2 items-end">
              <div className="text-xl font-semibold">
                {seriesInfo.ProductionYear}
              </div>
              <div>{seriesInfo.OfficialRating}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-10">
        <div className="text-3xl font-semibold">Cast</div>
        <div className="flex gap-x-4  pb-10 pt-4 overflow-x-scroll ">
          {seriesInfo.People.map(
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
                    <img
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
                      className="rounded-full bg-white aspect-square absolute top-0 left-0 z-20 object-cover"
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
  );
}

export default SeriesPage;
