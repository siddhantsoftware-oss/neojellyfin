import { useLocation } from "react-router-dom";
import { getAuth } from "../root";
import { DeviceProfile } from "../../sdk/server/deviceProfile";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

function MediaPlayback() {
  const mediaId = useLocation().pathname.replace("/playback/", "");

  const { data: mediaUrl } = useQuery(`${mediaId}-playback`, () =>
    fetch(`${localStorage.getItem("address")}/Sessions/Playing`, {
      method: "POST",
      headers: {
        Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CanSeek: true,
        ItemId: mediaId,
      }),
    })
      .then(() =>
        fetch(
          `${localStorage.getItem(
            "address"
          )}/Items/${mediaId}/PlaybackInfo?UserId=${localStorage.getItem(
            "userId"
          )}&MediaSourceId=${mediaId}&AutoOpenLiveStream=true`,
          {
            method: "POST",
            body: JSON.stringify({
              DeviceProfile: DeviceProfile,
            }),
            headers: {
              Authorization: getAuth(localStorage.getItem("AccessToken") ?? ""),
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json())
      )
      .then((result) => result.MediaSources[0].TranscodingUrl as string)
  );

          

  return <div>{mediaUrl}</div>;
}

export default MediaPlayback;
