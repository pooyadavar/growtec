import React from "react";
import IrrigationCard from "./IrrigationCard";

const IrrigationOneCard = (props) => {
  return (
    <IrrigationCard
      {...props}
      cardWidth="720px"
      cardScale="scale(0.92)"
      titleWidth="620px"
      titleBoxWidth="420px"
      titleLabelWidth="170px"
      chartAreaWidth="650px"
      chartBoxWidth="620px"
      tableWidth="612px"
      scheduleRowWidth="580px"
      scheduleRowScale="1"
      timeBoxWidth="100px"
      smallBoxWidth="48px"
      scheduleRowJustifyContent="space-between"
      unitInsideTitle
      titleJustifyContent="center"
      showScheduleScrollbar
      showScheduleDetailStatus
      scheduleLabelFontSize={11}
      volumeStatusBoxWidth="64px"
    />
  );
};

export default IrrigationOneCard;
