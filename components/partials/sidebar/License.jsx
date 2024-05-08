import React from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import Image from "next/image";
import { useSystemData } from "@/context/AuthProvider";
import { Icon } from "@iconify/react";
import { dateDiff, dayMessage, toFormatDateTime } from "@/helpers/helper";

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
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  // semi dark
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  const { operator } = useSystemData();

  const dayDiff = operator.expiration
    ? dateDiff(new Date(), new Date(operator.expiration))
    : null;

  return (
    <div
      className={` logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] py-6  px-4 
      ${menuHover ? "logo-hovered" : ""}
      ${
        skin === "bordered"
          ? " border-b border-r-0 border-slate-200 dark:border-slate-700"
          : " border-none"
      }
      
      `}
    >
      <div className="flex flex-col">
        <div
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
                : "heroicons-outline:check-circle"
            }
          />

          {(!collapsed || menuHover) && (
            <div className="flex flex-col italic">
              {operator.expiration == null && (
                <>
                  <div className="text-md">Licencia Permanente</div>
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
        </div>
      </div>
    </div>
  );
};

export default Licence;
