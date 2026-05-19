import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { DURATIONS } from "../right-botines/constants";
// Scene 1 y 7 son centradas — funcionan igual en vertical
import { Scene1Intro } from "../right-botines/Scene1Intro";
import { Scene7Cierre } from "../right-botines/Scene7Cierre";
// Escenas adaptadas para 1080×1920
import { Scene2V } from "./Scene2V";
import { Scene3V } from "./Scene3V";
import { Scene4V } from "./Scene4V";
import { Scene5V } from "./Scene5V";
import { Scene6V } from "./Scene6V";

export const RightBotinesVertical: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#07101a" }}>
      <Series>
        <Series.Sequence durationInFrames={DURATIONS.intro}>
          <Scene1Intro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.problema}>
          <Scene2V />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.home}>
          <Scene3V />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.carrito}>
          <Scene4V />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.estilo}>
          <Scene5V />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.resultado}>
          <Scene6V />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.cierre}>
          <Scene7Cierre />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
