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
      tableWidth="650px"
      scheduleRowWidth="640px"
      scheduleRowScale="1"
      timeBoxWidth="130px"
      smallBoxWidth="72px"
      scheduleRowJustifyContent="center"
      scheduleFieldGap="17px"
      unitInsideTitle
    />
  );
};

export default IrrigationOneCard;
