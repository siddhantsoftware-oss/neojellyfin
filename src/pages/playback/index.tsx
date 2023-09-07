import { useLocation } from "react-router-dom";
import { getAuth } from "../root";
import { DeviceProfile } from "../../sdk/server/deviceProfile";
import { useQuery } from "react-query";
import ReactHlsPlayer from "react-hls-player";
import { useRef } from "react";

function MediaPlayback() {
  const mediaId = useLocation().pathname.replace("/playback/", "");
  const playerRef = useRef<HTMLVideoElement>(null);

  const { data: mediaUrl } = useQuery(
    `${mediaId}-playback`,
    () =>
      fetch(`${localStorage.getItem("address")}/Sessions/Playing`, {
        method: "POST",
        headers: {
          Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CanSeek: true,
          ItemId: mediaId,
        }),
      })
        .then(() =>
          fetch(
            `${localStorage.getItem(
              "address"
            )}/Items/${mediaId}/PlaybackInfo?UserId=${localStorage.getItem(
              "userId"
            )}&MediaSourceId=${mediaId}&AutoOpenLiveStream=true`,
            {
              method: "POST",
              body: JSON.stringify({
                DeviceProfile: DeviceProfile,
              }),
              headers: {
                Authorization: getAuth(
                  localStorage.getItem("AccessToken") ?? ""
                ),
                "Content-Type": "application/json",
              },
            }
          ).then((res) => res.json())
        )
        .then((result) => result.MediaSources[0].TranscodingUrl as string),
    {
      retry: false,
      refetchOnWindowFocus: false
    }
  );

  return (
    <div className=" h-screen flex place-items-center max-h-screen justify-center">
      <ReactHlsPlayer
        src={`${localStorage.getItem("address")}${mediaUrl}`}
        playerRef={playerRef}
        className="w-full max-h-screen outline-none "
        autoPlay
        controls
      />
    </div>
  );
}

export default MediaPlayback;
