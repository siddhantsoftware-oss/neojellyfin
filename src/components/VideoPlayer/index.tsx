import ReactPlayer from "react-player";
import { getAuth } from "../../pages/root";
import { useNavigate } from "react-router-dom";

interface VideoPlayerProps {
  children: React.JSX.Element;
  playerRef: React.RefObject<ReactPlayer & HTMLVideoElement>;
  currentTime: number;
  mediaId: string;
  sessionId: string;
}
export const VideoPlayer = (props: VideoPlayerProps) => {
  const navigate = useNavigate();

  return (
    <div id="video-player" className="h-screen w-screen relative">
      <div className="absolute z-20 top-0 left-0 py-5 md:px-10 px-3 ">
        <button
          onClick={() => {
            fetch(
              `${localStorage.getItem("address")}/Sessions/Playing/Stopped`,
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
                  PositionTicks: Math.round(props.currentTime * 10000000),
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
    </div>
  );
};
