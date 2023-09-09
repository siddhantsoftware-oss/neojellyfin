import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "../root";
import { DeviceProfile } from "../../sdk/server/deviceProfile";
import { useQuery } from "react-query";
import { useRef, useState } from "react";
import Loading from "../../components/Loading";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  children: React.JSX.Element;
  fullVideoLength: number;
  playerRef: React.RefObject<ReactPlayer>;
  currentTime: number
}
const VideoPlayer = (props: VideoPlayerProps) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen relative">
      <div className="absolute z-20 top-0 left-0 py-5 px-10 ">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="flex gap-x-3 hover:-translate-x-2 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
          Go Back
        </button>
      </div>
      <div>{props.children}</div>
      {props.playerRef.current !== null ? (
        <div className="absolute w-full px-10 bg-secondary/20 backdrop-blur-sm py-5 bottom-0 left-0">
          <div className="text-sm opacity-70 ">
          {Math.round(props.currentTime/60) < 10 ? 0 : null}{Math.floor(props.currentTime/60)}:{Math.round(props.currentTime%60) < 10 ? 0 : null}{Math.round(props.currentTime%60)} / {Math.round(props.fullVideoLength/60) < 10 ? 0 : null}{Math.floor(props.fullVideoLength/60)}:{Math.round(props.fullVideoLength%60) < 10 ? 0 : null}{Math.round(props.fullVideoLength%60)}
          </div>
        </div>
      ) : null}
    </div>
  );
};

function MediaPlayback() {
  const mediaId = useLocation().pathname.replace("/playback/", "");
  const resumeTicks = useLocation().search.replace("?resume=", "") ?? 0;
  const playerRef = useRef<ReactPlayer>(null);

  const [currentTime, setCurrentTime] = useState(0)

  const onTimeUpdate = () => {
    const ref = playerRef.current
    if(ref){
      setCurrentTime(ref.getCurrentTime())
    }
  }



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

  const [videoLength, setVideoLength] = useState(0);

  if (!mediaUrl) {
    return <Loading />;
  }

  return (
    <div className=" h-screen flex place-items-center max-h-screen justify-center">
      <VideoPlayer fullVideoLength={videoLength} currentTime={currentTime} playerRef={playerRef}>
        <ReactPlayer
        onProgress={onTimeUpdate}
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
          onDuration={(duration) => setVideoLength(duration)}
        />
      </VideoPlayer>
    </div>
  );
}

export default MediaPlayback;
