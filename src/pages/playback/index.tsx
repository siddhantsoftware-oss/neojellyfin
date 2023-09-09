import { useLocation } from "react-router-dom";
import { getAuth } from "../root";
import { DeviceProfile } from "../../sdk/server/deviceProfile";
import { useQuery } from "react-query";
import { useRef } from "react";
import Loading from "../../components/Loading";
import ReactPlayer from "react-player";

function MediaPlayback() {
  const mediaId = useLocation().pathname.replace("/playback/", "");
  const resumeTicks = useLocation().search.replace("?resume=", "") ?? 0;

  const playerRef = useRef<ReactPlayer>(null);

  const { data: mediaUrl } = useQuery(
    `${mediaId}-playback`,
    () =>
      fetch(
        `${localStorage.getItem(
          "address"
        )}/Items/${mediaId}/PlayBackInfo?userId=${localStorage.getItem(
          "userId"
        )}&startTimeTicks=${Number(
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
                PositionTicks: isNaN(Number(resumeTicks))
                  ? 0
                  : Number(resumeTicks),
                RepeatMode: "RepeatNone",
              }),
            }
          ).then(() => {
            playerRef.current?.seekTo(
              Number(resumeTicks) / 10000000,
              "seconds"
            );
          })
        ),
    }
  );

  if (!mediaUrl) {
    return <Loading />;
  }

  return (
    <div className=" h-screen flex place-items-center max-h-screen justify-center">
      <ReactPlayer
        url={`${localStorage.getItem("address")}${
          mediaUrl.MediaSources[0].TranscodingUrl + ""
        }`}
        playbackRate={1}
        playing={true}
        ref={playerRef}
        width={"100%"}
        height={"100vh"}
        style={{
          backgroundColor: "black",
        }}
        config={{
          file: {
            forceHLS: true,
          },
        }}
      />
    </div>
  );
}

export default MediaPlayback;
