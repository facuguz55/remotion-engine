import React from "react";
import { Composition, registerRoot } from "remotion";
import { HelloWorld } from "./compositions/HelloWorld";

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
    </>
  );
};

registerRoot(RemotionRoot);
