import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { DURATIONS } from "./constants";
import { NorthzoneScene1 } from "./NorthzoneScene1";
import { NorthzoneScene2 } from "./NorthzoneScene2";
import { NorthzoneScene3 } from "./NorthzoneScene3";
import { NorthzoneScene4 } from "./NorthzoneScene4";
import { NorthzoneScene5 } from "./NorthzoneScene5";
import { NorthzoneScene6 } from "./NorthzoneScene6";
import { NorthzoneScene7 } from "./NorthzoneScene7";

export const NorthzoneVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <Series>
        <Series.Sequence durationInFrames={DURATIONS.hook}>
          <NorthzoneScene1 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.problema}>
          <NorthzoneScene2 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.solucion}>
          <NorthzoneScene3 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.automations}>
          <NorthzoneScene4 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.chat}>
          <NorthzoneScene5 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.clientes}>
          <NorthzoneScene6 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS.cierre}>
          <NorthzoneScene7 />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
