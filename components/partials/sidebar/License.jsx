import React, { useState } from "react";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import Image from "next/image";
import { useSystemData } from "@/context/AuthProvider";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { useWs } from "@/context/WsProvider";
import { WS_STATUS } from "@/helpers/helper";

export const MainLogo = ({
  logo,
  fallBack = "/assets/images/logo.png",
  width = 100,
  className = "logo-icon",
}) => (
  <Image
    src={logo?.preview ?? fallBack}
    alt="Logo"
    height={0}
    width={width}
    priority
    className={className}
  />
);

const Licence = ({ menuHover }) => {
  const ws = useWs();
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  // semi dark
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  const { operator } = useSystemData();

  // const dayDiff = operator.expiration
  //   ? dateDiff(new Date(), new Date(operator.expiration))
  //   : null;

  return (
    <div
      className={` logo-segment bg-white dark:bg-slate-800 z-[9] py-6  px-4 
      ${menuHover ? "logo-hovered" : ""}
      ${
        skin === "bordered"
          ? " border-b border-r-0 border-slate-200 dark:border-slate-700"
          : " border-none"
      }
      
      `}
    >
      <div className="flex flex-col gap-2">
        {ws.status == WS_STATUS.connected ? (
          operator.rpas.map((x) => (
            <div
              className="flex flex-row justify-between items-center"
              key={x.code}
            >
              {(!collapsed || menuHover) && (
                <div className="text-slate-500 font-bold">{x.name}</div>
              )}
              <div>
                <LoadingIcon
                  height="24"
                  className={
                    ws.info[x.code]
                      ? ws.info[x.code]?.isLocked
                        ? "text-primary-500"
                        : "text-success-500"
                      : "text-danger-500"
                  }
                  isLoading={ws.info[x.code]?.isLocked}
                  icon={
                    ws.info[x.code]
                      ? `heroicons-outline:check-circle`
                      : `heroicons-outline:no-symbol`
                  }
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-row items-center gap-5">
            <LoadingIcon height="32" isLoading={true} />
            <div className="font-bold">Conectando...</div>
          </div>
        )}
      </div>
      {/* <div
          className={`flex items-center space-x-4 
          ${
            dayDiff != null &&
            dayDiff <= process.env.NEXT_PUBLIC_EXPIRATION_DAYS_LIMIT
              ? "text-warning-500"
              : "text-success-500"
          }
         `}
        >
          <Icon
            height="32"
            icon={
              dayDiff != null &&
              dayDiff <= process.env.NEXT_PUBLIC_EXPIRATION_DAYS_LIMIT
                ? "heroicons-outline:exclamation-circle"
                : "heroicons-outline:check-badge"
            }
          />

          {(!collapsed || menuHover) && (
            <div className="flex flex-col italic ">
              {operator.expiration == null && (
                <>
                  <div className="text-md text-sm">Licencia Permanente</div>
                </>
              )}

              {operator.expiration != null && (
                <>
                  <div className="text-md">Licencia Válida</div>
                  <div className="text-sm">{dayMessage(dayDiff)}</div>
                </>
              )}
            </div>
          )}
        </div> */}
    </div>
  );
};

export default Licence;
