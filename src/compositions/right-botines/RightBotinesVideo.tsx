import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { DURATIONS } from "./constants";
import { Scene1Intro } from "./Scene1Intro";
import { Scene2Problema } from "./Scene2Problema";
import { Scene3Home } from "./Scene3Home";
import { Scene4Carrito } from "./Scene4Carrito";
import { Scene5Estilo } from "./Scene5Estilo";
import { Scene6Resultado } from "./Scene6Resultado";
import { Scene7Cierre } from "./Scene7Cierre";

export const RightBotinesVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#07101a" }}>
      <Series>
        <Series.Sequence durationInFrames={DURATIONS.intro}>
          <Scene1Intro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.problema}>
          <Scene2Problema />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.home}>
          <Scene3Home />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.carrito}>
          <Scene4Carrito />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.estilo}>
          <Scene5Estilo />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.resultado}>
          <Scene6Resultado />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DURATIONS.cierre}>
          <Scene7Cierre />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
