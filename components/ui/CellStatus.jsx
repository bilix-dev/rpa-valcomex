import React from "react";
import Badge from "./Badge";
import { CONTAINER_STATUS } from "@/helpers/helper";
const CellStatus = ({ text }) => {
  let color = "bg-slate-500";

  switch (text) {
    case CONTAINER_STATUS.PENDIENTE:
      color = "bg-warning-500";
      break;
    case CONTAINER_STATUS.MATCH:
      color = "bg-violet-500";
      break;
    case CONTAINER_STATUS.PROCESANDO:
      color = "bg-info-500";
      break;
    case CONTAINER_STATUS.TRAMITADO:
      color = "bg-primary-500";
      break;
    case CONTAINER_STATUS.FINALIZADO:
      color = "bg-success-500";
      break;
    case CONTAINER_STATUS.ESPERA:
      color = "bg-slate-500";
      break;
    case CONTAINER_STATUS.ANULADO:
      color = "bg-danger-500";
      break;
    case CONTAINER_STATUS.ERROR:
      color = "bg-danger-500";
      break;
  }

  return (
    <Badge className={`${color} text-white w-min capitalize`} label={text} />
  );
};

export default CellStatus;
