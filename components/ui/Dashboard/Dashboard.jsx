"use client";
import { toFormatDateTime } from "@/helpers/helper";
import React, { useMemo, useState } from "react";
import CustomTable from "../CustomTable";
import Card from "../Card";

const Dashboard = ({ data }) => {
  return (
    <div className="grid gap-5">
      <div className="grid md:grid-cols-3 grid-cols-1 items-center gap-5 ">
        <div className="grid md:grid-cols-1 grid-cols-3 gap-5">
          <Card noborder title={<div className="text-md">Últimos 5 Match</div>}>
            <CustomTable
              headers={["Contenedor", "Chofer", "DNI", "Patente", "Match"]}
              data={data.lastInscriptions}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
