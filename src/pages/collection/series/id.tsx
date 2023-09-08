import { useLocation } from "react-router-dom";

function SeriesPage() {
  const seriesId = useLocation().pathname.replace("/collection/series/", "");

  return (
    <div className="px-10 flex gap-x-5">
      <div className="basis-1/6">
        <img
          src={`${localStorage.getItem(
            "address"
          )}/Items/${seriesId}/Images/Primary`}
          alt=""
          className="rounded-md"
        />
      </div>
      <div>hi</div>
    </div>
  );
}

export default SeriesPage;
