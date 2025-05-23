import { toFormatDateTime } from "@/helpers/helper";
import React from "react";

const CellMatch = ({ match }) => {
  return (
    match && (
      <ol className="list-disc">
        <li>
          <div className="text-xs">{match.user.fullName}</div>
        </li>
        <li>
          <div className="text-xs">{match.user.dni}</div>
        </li>
        <li>
          <div className="text-xs">{match.plateNumber}</div>
        </li>
      </ol>
    )
  );
};

export default CellMatch;
