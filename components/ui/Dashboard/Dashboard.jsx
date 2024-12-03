"use client";
import React, { useMemo, useState } from "react";
import CustomTable from "../CustomTable";
import Card from "../Card";
import Button from "../Button";
import useAuth from "@/hooks/useAuth";
import { useSystemData } from "@/context/AuthProvider";
import useAxios from "@/hooks/useAxios";

const Dashboard = ({ data }) => {
  const fetcher = useAxios();
  const { user } = useSystemData();
  const { hasRoleAccess } = useAuth();

  const statistics = useMemo(
    () => [
      {
        title: "Inscripciones",
        bg: "bg-slate-500",
        btn_title: "",
        text: "text-slate-500",
        icon: "heroicons-outline:truck",
        btn: "btn-dark btn-sm rounded-[999px]",
        link: "/inscriptions",
        grant: "inscriptions",
      },
      {
        title: "Matching",
        bg: "bg-primary-500",
        btn_title: "",
        text: "text-primary-500",
        icon: "heroicons-outline:document-check",
        btn: "btn-primary btn-sm rounded-[999px]",
        link: "/matching",
        grant: "matching",
      },
      {
        title: "Carga Masiva (OS)",
        bg: "bg-success-500",
        btn_title: "",
        text: "text-success-500",
        icon: "heroicons-outline:document-plus",
        btn: "btn-success btn-sm rounded-[999px]",
        link: "/os/massive",
        grant: "os/massive",
      },
    ],
    []
  );

  return (
    <div className="grid gap-5">
      <div
        className={`bg-primary-500 rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
      >
        <span className="block text-sm text-primary-600 font-medium dark:text-white mb-1">
          Bienvenido
        </span>

        <span className="block mb- text-2xl text-primary-600 dark:text-white font-medium">
          {user.name}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 items-center lg:gap-x-5 gap-y-5 ">
        <div className="grid lg:grid-cols-1 grid-cols-3 gap-5">
          {statistics.map((item, i) => (
            <div
              key={i}
              className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
            >
              <div
                className={`${item.text} mx-auto h-10 w-10 flex flex-col items-center justify-center text-2xl mb-4 `}
              >
                <Button
                  text={item.btn_title}
                  icon={item.icon}
                  className={item.btn}
                  link={hasRoleAccess(item.grant, "view") ? item.link : null}
                  disabled={!hasRoleAccess(item.grant, "view")}
                />
              </div>

              <span className="block text-sm text-slate-600 font-medium dark:text-white mb-1">
                {item.title}
              </span>

              <span className="block mb- text-2xl text-slate-900 dark:text-white font-medium">
                {item.count}
              </span>
            </div>
          ))}
        </div>
        <div className="col-span-3">
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
