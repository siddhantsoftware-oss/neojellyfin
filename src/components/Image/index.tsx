import React, { useState } from "react";

interface ImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  Ratio: number;
  className?: string;
}

function Image(props: ImageProps) {
  const [hasLoadedYet, setHasLoadedYet] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <div
      className={props.className}
      style={{
        aspectRatio: props.Ratio,
        width: props.width,
        height: props.height,
        position: "relative",
      }}
    >
      <img
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        style={{
          aspectRatio: props.Ratio,
        }}
        className={`${
          hasLoadedYet || !hasFailed ? "visible" : "invisible"
        } object-cover ${props.className}`}
        onLoad={(event) => {
          setHasLoadedYet(true);
          if (props.onLoad) {
            props.onLoad(event);
          }
        }}
        onError={() => setHasFailed(true)}
      />
      {!hasLoadedYet || hasFailed ? (
        <div className={`w-full ${props.className} flex place-items-center justify-center h-full absolute top-0 left-0 z-20 bg-accent`}>
          {hasFailed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 fill-red-600"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 animate-pulse"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Image;
