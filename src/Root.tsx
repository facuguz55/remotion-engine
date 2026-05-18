import React from "react";
import { Composition, registerRoot } from "remotion";
import { HelloWorld } from "./compositions/HelloWorld";
import { RightBotinesVideo } from "./compositions/right-botines/RightBotinesVideo";
import { DURATIONS } from "./compositions/right-botines/constants";

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
    </>
  );
};

registerRoot(RemotionRoot);
