import { useLocation } from "react-router-dom";
import { getAuth } from "../root";
import { DeviceProfile } from "../../sdk/server/deviceProfile";
import { useQuery } from "react-query";
import ReactHlsPlayer from "react-hls-player";
import { useRef } from "react";

function MediaPlayback() {
  const mediaId = useLocation().pathname.replace("/playback/", "");
  const resumeTicks = useLocation().search.replace("?resume=", "") ?? 0;

  const playerRef = useRef<HTMLVideoElement>(null);

  const { data: mediaUrl } = useQuery(
    `${mediaId}-playback`,
    () =>
      fetch(
        `${localStorage.getItem(
          "address"
        )}/Items/${mediaId}/PlayBackInfo?UserId=${localStorage.getItem(
          "userId"
        )}&StartTimeTicks=${resumeTicks}&IsPlayback=true&AutoOpenLiveStream=true`,
        {
          method: "POST",
          headers: {
            Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DeviceProfile: DeviceProfile,
          }),
        }
      ).then((res) =>
        res.json().then((result) =>
          fetch(`${localStorage.getItem("address")}/Sessions/Playing`, {
            method: "POST",
            headers: {
              Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              MediaSourceId: mediaId,
              ItemId: mediaId,
              PositionTicks: resumeTicks,
              PlaySessionId: result.PlaySessionId,
              PlayMethod: "Transcode",
              isPaused: false,
              isMuted: false,
              CanSeek: true,
              PlaybackRate: 1,
              RepeatMode: "RepeatNone"
            }),
          }).then(() => result.MediaSources[0].TranscodingUrl as string)
        )
      ),
    {
      retry: false,
      refetchOnWindowFocus: false,
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
