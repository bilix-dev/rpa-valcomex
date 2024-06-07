import React from "react";
import Badge from "./Badge";
import { OS_STATUS } from "@/helpers/helper";
const CellOsStatus = ({ text }) => {
  let color = "bg-slate-500";

  switch (text) {
    case OS_STATUS.VACIO:
      color = "bg-slate-500";
      break;
    case OS_STATUS.CERRADA:
      color = "bg-success-500";
      break;
    case OS_STATUS.ABIERTA:
      color = "bg-primary-500";
      break;
  }

  return (
    <Badge className={`${color} text-white w-min capitalize`} label={text} />
  );
};

export default CellOsStatus;
