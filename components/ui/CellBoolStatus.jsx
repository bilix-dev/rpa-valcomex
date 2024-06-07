import React from "react";
import Badge from "./Badge";
const CellBoolStatus = ({ status }) => {
  let color = "bg-slate-500";
  let text = "Inactivo";

  if (status) {
    color = "bg-primary-500";
    text = "Activo";
  }

  return (
    <Badge className={`${color} text-white w-min capitalize`} label={text} />
  );
};

export default CellBoolStatus;
