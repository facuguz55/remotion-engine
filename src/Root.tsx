import React from "react";
import { Composition, registerRoot } from "remotion";
import { HelloWorld } from "./compositions/HelloWorld";
import { RightBotinesVideo } from "./compositions/right-botines/RightBotinesVideo";
import { RightBotinesVertical } from "./compositions/right-botines-vertical/RightBotinesVertical";
import { DURATIONS } from "./compositions/right-botines/constants";
import { NorthzoneVideo } from "./compositions/northzone/NorthzoneVideo";
import { DURATIONS as NZ_DURATIONS } from "./compositions/northzone/constants";
import {
  AgencyVideo,
  calculateMetadata as agencyCalcMetadata,
  DEFAULT_AGENCY_PROPS,
} from "./compositions/agency-video/AgencyVideo";

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ message: "Remotion Engine" }}
      />
      <Composition
        id="RightBotines"
        component={RightBotinesVideo}
        durationInFrames={DURATIONS.total}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RightBotinesVertical"
        component={RightBotinesVertical}
        durationInFrames={DURATIONS.total}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NorthzoneVideo"
        component={NorthzoneVideo}
        durationInFrames={NZ_DURATIONS.total}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AgencyVideo"
        component={AgencyVideo}
        durationInFrames={DEFAULT_AGENCY_PROPS.slides.length * 90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={DEFAULT_AGENCY_PROPS}
        calculateMetadata={agencyCalcMetadata}
      />
    </>
  );
};

registerRoot(RemotionRoot);
