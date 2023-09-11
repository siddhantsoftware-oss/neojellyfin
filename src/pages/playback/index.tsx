import { useLocation } from "react-router-dom";
import { getAuth } from "../root";
import { DeviceProfile } from "../../sdk/server/deviceProfile";
import { useQuery } from "react-query";
import { useRef, useState } from "react";
import Loading from "../../components/Loading";
import ReactPlayer from "react-player";
import { VideoPlayer } from "../../components/VideoPlayer";
import usePlayer from "./playerStore";

function MediaPlayback() {
  const mediaId = useLocation().pathname.replace("/playback/", "");
  const resumeTicks = useLocation().search.replace("?resume=", "") ?? 0;
  const playerRef = useRef<ReactPlayer & HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState(0);



  const onTimeUpdate = () => {
    const ref = playerRef.current;
    if (ref) {
      setCurrentTime(ref.getCurrentTime());
    }
  };

  const { data: media } = useQuery(
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

  const [playing, setPlaying] = usePlayer((state) => [
    state.playing,
    state.setPlaying,
  ]);

  if (!media) {
    return <Loading />;
  }

  return (
    <div className=" h-screen outline-none  flex place-items-center max-h-screen justify-center">
      <VideoPlayer
        MediaStreams={media.MediaSources[0].MediaStreams}
        sessionId={media.PlaySessionId}
        defaultSubtitleStream={media.MediaSources[0].DefaultSubtitleStreamIndex}
        defaultAudioStream={media.MediaSources[0].DefaultAudioStreamIndex}
        mediaId={mediaId}
        currentTime={currentTime}
        playerRef={playerRef}
        
      >
        <ReactPlayer
          onProgress={onTimeUpdate}
          url={`${localStorage.getItem("address")}${
            media.MediaSources[0].TranscodingUrl + ""
          }`}
          playsinline
          playing={playing}
          playbackRate={1}
          ref={playerRef}
          width={"100%"}
          height={"100vh"}
          style={{
            backgroundColor: "black",
            outline: "2px solid transparent",
          }}
          config={{
            file: {
              forceHLS: true,
            },
          }}
          onPause={() => {
            setPlaying(false);

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
                  IsPaused: true,
                  EventName: "pause",
                  PlayMethod: "Transcode",
                  PlaySessionId: media.PlaySessionId,
                  PositionTicks: Math.round(
                    (playerRef.current?.getCurrentTime() ?? 0) * 1000000
                  ),
                  RepeatMode: "RepeatNone",
                }),
              }
            );
          }}
          onPlay={() => {
            setPlaying(true)
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
                  EventName: "unpause",
                  PlayMethod: "Transcode",
                  PlaySessionId: media.PlaySessionId,
                  PositionTicks: Math.round(
                    (playerRef.current?.getCurrentTime() ?? 0) * 1000000
                  ),
                  RepeatMode: "RepeatNone",
                }),
              }
            );
          }}
          onSeek={() => {
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
                  EventName: "timeupdate",
                  PlayMethod: "Transcode",
                  PlaySessionId: media.PlaySessionId,
                  PositionTicks: Math.round(
                    (playerRef.current?.getCurrentTime() ?? 0) * 1000000
                  ),
                  RepeatMode: "RepeatNone",
                }),
              }
            );
          }}
        />
      </VideoPlayer>
    </div>
  );
}

export default MediaPlayback;
