import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../pages/root";
import { SetStateAction, useEffect, useState } from "react";

interface VideoPlayerProps {
  children: React.JSX.Element;
  fullVideoLength: number;
  playerRef: React.RefObject<ReactPlayer & HTMLVideoElement>;
  currentTime: number;
  mediaId: string;
  sessionId: string;
  setPlaying: React.Dispatch<SetStateAction<boolean>>;
  playing: boolean;
}
export const VideoPlayer = (props: VideoPlayerProps) => {
  const pauseStream = () => {
    props.setPlaying((e) => !e);
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

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const navigate = useNavigate();
  return (
    <div id="video-player" className="h-screen w-screen relative">
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
      {props.playerRef.current !== null ? (
        <div className="flex absolute w-full bottom-0 flex-col">
          <div className="absolute top-0 z-20 w-full">
            <input
              type="range"
              className="w-full cursor-pointer "
              value={props.currentTime}
              onChange={(e) => {
                props.playerRef.current?.seekTo(
                  e.target.valueAsNumber,
                  "seconds"
                );
              }}
              min={0}
              max={props.playerRef.current.getDuration()}
            />
          </div>
          <div className="grid grid-cols-3 w-full px-10 bg-accent/80 backdrop-blur-sm pt-8 py-5 bottom-0 left-0">
            <div className="text-sm opacity-70 text-left flex gap-x-1">
              {getTimeStandard(props.currentTime)}/
              {getTimeStandard(props.fullVideoLength)}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  pauseStream();
                }}
              >
                {props.playing ? (
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
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex justify-end">
              {isFullscreen ? (
                <button
                  onClick={() => {
                    document.exitFullscreen();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const element = document.getElementById("video-player");
                    if (element?.requestFullscreen) {
                      element.requestFullscreen();
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
