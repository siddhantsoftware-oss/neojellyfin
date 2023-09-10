import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "../../../root";
import { MediaType } from "../../../../sections/RecentlyAdded";
import Loading from "../../../../components/Loading";
import { useState } from "react";

function EditPage() {
  const mediaId = useLocation()
    .pathname.replace("/collection/media/", "")
    .replace("/edit", "")
    .replace("/", "");

  type searchParameters = {
    Name: string;
    Year?: number;
    IMBD?: string;
    Type: string;
  };
  const searchForMatches = useMutation({
    mutationFn: (props: searchParameters) =>
      fetch(
        `${localStorage.getItem("address")}/Items/RemoteSearch/${props.Type}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuth(`${localStorage.getItem("AccessToken")}`),
          },
          method: "POST",
          body: JSON.stringify({
            ItemId: mediaId,
            SearchInfo: {
              Name: props.Name,
              Year: props.Year,
              ProviderIds: {
                Imdb: props.IMBD,
              },
            },
          }),
        }
      )
        .then((res) => res.json())
        .then(
          (result) =>
            result as {
              Name: string;
              ProviderIds: {
                Tmdb?: string;
                Imdb?: string;
              };
              PremiereDate: Date;
              ImageUrl?: string;
              SearchProviderName: string;
              Overview: string;
              Artists: string[];
            }[]
        ),
  });

  const navigate = useNavigate();

  type UpdateProps = {
    Artists: string[];
    ImageUrl: string;
    Name: string;
    ProductionYear: number;
    ProviderIds: { [Provider: string]: string };
    SearchProviderName: string;
  };
  const { mutate: updateInformation, isLoading } = useMutation({
    mutationFn: (props: UpdateProps) =>
      fetch(
        `${localStorage.getItem(
          "address"
        )}/Items/RemoteSearch/Apply/${mediaId}?ReplaceAllImages=true`,
        {
          method: "POST",
          headers: {
            Authorization: getAuth(`${localStorage.getItem("AccessToken")}`),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(props),
        }
      ),
    onSuccess: () => navigate(-1),
  });

  const { data: media } = useQuery(mediaId + "_metadata", () =>
    fetch(
      `${localStorage.getItem("address")}/Users/${localStorage.getItem(
        "userId"
      )}/Items/${mediaId}`,
      {
        headers: {
          Authorization: getAuth(`${localStorage.getItem("AccessToken")}`),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => result as MediaType)
  );

  const [name, setName] = useState("");
  const [year, setYear] = useState(0);
  const [imdb, setImdb] = useState("");

  if (!media || isLoading) {
    return <Loading />;
  }

  return (
    <div className="mx-10 items-center pb-20 flex flex-col gap-y-10">
      <div className="text-4xl font-bold text-center w-full">{media.Name}</div>
      <div className="flex flex-col gap-y-5 w-full items-center">
        <div className="text-4xl">Content Information</div>
        <div className="w-full max-w-[500px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchForMatches.mutate({
                Name: name,
                Type: media.Type,
                IMBD: imdb,
                Year: year,
              });
            }}
            className="w-full flex flex-col gap-y-3"
          >
            <input
              type="text"
              placeholder="Name *"
              required
              onChange={(e) => setName(e.target.value)}
              className="px-6 mb-3 font-semibold text-xl outline-none  rounded-md w-full bg-accent  py-3"
            />
            <input
              type="number"
              onChange={(e) => setYear(e.target.valueAsNumber)}
              placeholder="Year"
              className="px-6 font-semibold text-xl outline-none  rounded-md w-full bg-accent  py-3"
            />
            <input
              onChange={(e) => setImdb(e.target.value)}
              type="text"
              placeholder="IMDB"
              className="px-6 font-semibold text-xl outline-none  rounded-md w-full bg-accent  py-3"
            />
            <button
              type="submit"
              className="py-2 bg-primary font-semibold rounded-md text-xl hover:opacity-70 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      {searchForMatches.data ? (
        <div className="flex flex-wrap gap-8">
          {searchForMatches.data.map((item, idx) => (
            <button
              onClick={(e) => {
                e.preventDefault();
                updateInformation({
                  Artists: item.Artists,
                  ImageUrl: item?.ImageUrl ?? "",
                  Name: item.Name,
                  ProductionYear: new Date(item.PremiereDate).getFullYear(),
                  ProviderIds: item.ProviderIds,
                  SearchProviderName: item.SearchProviderName,
                });
              }}
              className="max-w-[200px] hover:scale-105 transition text-center"
              key={idx}
            >
              <div>
                {item.ImageUrl ? (
                  <img
                    src={item.ImageUrl}
                    width={200}
                    alt=""
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-[200px] aspect-[2/3] bg-accent flex place-items-center justify-center font-semibold text-xl rounded-md">
                    No Image
                  </div>
                )}
              </div>
              <div className="text-lg font-semibold">{item.Name}</div>
              {item.PremiereDate ? (
                <div>{new Date(item.PremiereDate).getFullYear()}</div>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default EditPage;
