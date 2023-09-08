import { useLocation } from "react-router-dom";
import { getAuth } from "../root";
import { DeviceProfile } from "../../sdk/server/deviceProfile";
import { useQuery } from "react-query";
import ReactHlsPlayer from "react-hls-player";
import { useRef } from "react";
import Loading from "../../components/Loading";

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
        )}&StartTimeTicks=${Number(
          resumeTicks
        )}&IsPlayback=true&AutoOpenLiveStream=true`,
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
      ).then((res) => res.json()),
    {
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (result) =>
        fetch(`${localStorage.getItem("address")}/Sessions/Playing`, {
          method: "POST",
          headers: {
            Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IsPaused: false,
            ItemId: mediaId,
            IsMuted: false,
            MediaSourceId: mediaId,
            CanSeek: true,
            PlayMethod: "Transcode",
            PlaySessionId: result.PlaySessionId,
            AudioStreamIndex: 1,
            PositionTicks: isNaN(Number(resumeTicks)) ? 0 : Number(resumeTicks),
            RepeatMode: "RepeatNone",
          }),
        }).then(() =>
          fetch(
            `${localStorage.getItem("address")}/Sessions/Playing/Progress`,
            {
              method: "POST",
              headers: {
                Authorization: getAuth(
                  localStorage.getItem("AccessToken") ?? ""
                ),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                AudioStreamIndex: 1,
                CanSeek: true,
                IsPaused: false,
                isMuted: false,
                EventName: "timeupdate",
                PlayMethod: "Transcode",
                PlaySessionId: result.PlaySessionId,
                PositionTicks: isNaN(Number(resumeTicks)) ? 0 : Number(resumeTicks),
                RepeatMode: "RepeatNone",
              }),
            }
          )
        ),
    }
  );

  if (!mediaUrl) {
    return <Loading />;
  }

  return (
    <div className=" h-screen flex place-items-center max-h-screen justify-center">
      <ReactHlsPlayer
        src={`${localStorage.getItem("address")}${
          mediaUrl.MediaSources[0].TranscodingUrl+""
        }`}
        playerRef={playerRef}
        autoPlay
        className="w-full max-h-screen outline-none "
      />
    </div>
  );
}

export default MediaPlayback;
