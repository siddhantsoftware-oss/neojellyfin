import ReactPlayer from "react-player";
import { getAuth } from "../../pages/root";
import { useNavigate } from "react-router-dom";
import usePlayer from "../../pages/playback/playerStore";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";

interface VideoPlayerProps {
  children: React.JSX.Element;
  playerRef: React.RefObject<ReactPlayer>;
  currentTime: number;
  mediaId: string;
  sessionId: string;
  MediaStreams: {
    Type: string;
    DisplayTitle: string;
    Index: number;
  }[];
  defaultSubtitleStream: number;
  defaultAudioStream: number;
}
export const VideoPlayer = (props: VideoPlayerProps) => {
  const navigate = useNavigate();

  const TimeCounter = (timeProps: { time: number; long: boolean }) => {
    const hours = Math.floor(timeProps.time / 3600);
    const minutes = Math.floor(timeProps.time / 60) - hours * 60;
    const seconds = Math.floor(timeProps.time) - (hours * 3600 + minutes * 60);

    return (
      <div>
        {timeProps.long ? "0" + hours + ":" : null}
        {minutes < 10 ? 0 : null}
        {minutes}:{seconds < 10 ? 0 : null}
        {seconds}
      </div>
    );
  };

  const [playing, setPlaying] = usePlayer((state) => [
    state.playing,
    state.setPlaying,
  ]);

  return (
    <div id="video-player" className="h-screen w-screen relative">
      <div className="absolute z-20 top-0 left-0 w-full bg-gradient-to-b from-black/60  h-[8vh] to-transparent py-5 md:px-10 px-3 ">
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
            );
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
      {props.playerRef.current ? (
        <div className="absolute  bottom-0 w-full ">
          <div className="relative h-full">
            <div className="z-20 absolute h-[22px] left-0 top-0 -translate-y-[110%] w-full">
              <div
                style={{
                  width:
                    (props.playerRef.current.getCurrentTime() /
                      props.playerRef.current.getDuration()) *
                      100 +
                    "%",
                }}
                className=" absolute h-[65%] translate-y-[115%] z-50 left-0 bg-primary"
              ></div>
              <div
                style={{
                  width:
                    (props.playerRef.current.getSecondsLoaded() /
                      props.playerRef.current.getDuration()) *
                      100 +
                    "%",
                }}
                className=" absolute h-[65%] translate-y-[115%] z-40 rounded-r-sm left-0 bg-secondary/40"
              ></div>
              <div className=" absolute h-[65%] w-full translate-y-[115%] z-20  left-0 bg-accent"></div>
              <input
                onChange={(e) => {
                  if (props.playerRef.current?.seekTo) {
                    props.playerRef.current.seekTo(e.target.valueAsNumber);
                  }
                }}
                max={props.playerRef.current.getDuration()}
                value={props.playerRef.current.getCurrentTime()}
                type="range"
                className="w-full translate-y-[100%] cursor-pointer absolute appearance-none bg-transparent z-50 accent-white "
              />
            </div>
            <div className="flex justify-between bg-accent/70 backdrop-blur-md pb-4 pt-6 px-10 w-full">
              <div className="flex gap-x-1 opacity-80 ">
                <TimeCounter
                  long={(props.playerRef.current?.getDuration() ?? 0) > 3600}
                  time={props.playerRef.current?.getCurrentTime() ?? 0}
                />{" "}
                /{" "}
                <TimeCounter
                  long={(props.playerRef.current?.getDuration() ?? 0) > 3600}
                  time={props.playerRef.current?.getDuration() ?? 0}
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    setPlaying(!playing);
                  }}
                >
                  {!playing ? (
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
                  ) : (
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
                  )}
                </button>
              </div>
              <div>
                <Popover>
                  <PopoverTrigger>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="bg-accent text-white outline-none">
                    <div className=" grid gap-y-3">
                      <select
                        className="bg-secondary/20 outline-none px-2 py-1 rounded-sm font-semibold"
                        name=""
                        id=""
                        defaultValue={props.defaultSubtitleStream}
                      >
                        {props.MediaStreams.filter(
                          (e) => e.Type === "Subtitle"
                        ).map((stream) => (
                          <option value={stream.Index} key="">
                            {stream.DisplayTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
