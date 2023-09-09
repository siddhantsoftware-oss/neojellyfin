import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../pages/root";

interface VideoPlayerProps {
  children: React.JSX.Element;
  fullVideoLength: number;
  playerRef: React.RefObject<ReactPlayer & HTMLVideoElement>;
  currentTime: number;
  mediaId: string;
  sessionId: string;
}
export const VideoPlayer = (props: VideoPlayerProps) => {
  const pauseStream = () => {
    props.playerRef.current?.getInternalPlayer("hls");
  };

  const getTimeStandard = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);

    return (
      <div>
        {hours < 10 ? 0 : null}
        {hours}:{minutes - 60 * hours < 10 ? 0 : null}
        {minutes - 60 * hours}:
        {Math.round(seconds) - minutes * 60 < 10 ? 0 : null}
        {Math.round(seconds) - minutes * 60}
      </div>
    );
  };

  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen relative">
      <div className="absolute z-20 top-0 left-0 py-5 px-10 ">
        <button
          onClick={() => {
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
                  IsPaused: true,
                  PositionTicks: props.currentTime * 10000000,
                  PlaySessionId: props.sessionId,
                  ItemId: props.mediaId,
                  UserId: localStorage.getItem("userId"),
                  MediaSourceId: props.mediaId,
                  PlayMethod: "Transcode",
                  AudioStreamIndex: 1,
                  BufferedRanges: [],
                  CanSeek: true,
                  IsMuted: false,
                  EventName: "pause",
                }),
              }
            ).then(() => navigate(-1));
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
        <div className="flex absolute w-full bottom-0 flex-col">
          <div className="absolute top-0 z-20 w-full">
            <input
              type="range"
              className="w-full "
              value={
                (props.currentTime / props.playerRef.current.getDuration()) *
                100
              }
              onChange={(e) => {
                props.playerRef.current?.seekTo(
                  (e.target.valueAsNumber/100) *
                    props.playerRef.current.getDuration(),
                  "seconds"
                );
              }}
              min={0}
              max={100}
            />
          </div>
          <div className="grid grid-cols-3 w-full px-10 bg-secondary/20 backdrop-blur-sm pt-8 py-5 bottom-0 left-0">
            <div className="text-sm opacity-70 text-left flex gap-x-1">
              {getTimeStandard(props.currentTime)}/
              {getTimeStandard(props.fullVideoLength)}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  pauseStream();
                  console.log("hi");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-end">hi</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
