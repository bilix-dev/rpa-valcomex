import React from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import Image from "next/image";
import { useSystemData } from "@/context/AuthProvider";

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

const SidebarLogo = ({ menuHover }) => {
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  // semi dark
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();

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
        <Link href="/">
          <div className="flex items-center space-x-4">
            <MainLogo width={48} />
            {(!collapsed || menuHover) && (
              <div>
                <Image
                  src={
                    isDark
                      ? "/assets/images/logo-text-white.png"
                      : "/assets/images/logo-text-black.png"
                  }
                  alt="Logo"
                  height={0}
                  width={120}
                  priority
                  className={"logo-icon"}
                />
              </div>
            )}

            {/* <div className="logo-icon">
            {!isDark && !isSemiDark ? (
              <img src="/assets/images/logo/logo-c.svg" alt="" />
            ) : (
              <img src="/assets/images/logo/logo-c-white.svg" alt="" />
            )}
          </div>

          {(!collapsed || menuHover) && (
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                DashCode
              </h1>
            </div>
          )} */}
          </div>
        </Link>
      </div>
      {(!collapsed || menuHover) && (
        <div
          onClick={() => setMenuCollapsed(!collapsed)}
          className={`h-4 w-4 border-[1.5px] border-slate-900 dark:border-slate-700 rounded-full transition-all duration-150
          ${
            collapsed
              ? ""
              : "ring-2 ring-inset ring-offset-4 ring-black-900 dark:ring-slate-400 bg-slate-900 dark:bg-slate-400 dark:ring-offset-slate-700"
          }
          `}
        ></div>
      )}
    </div>
  );
};

export default SidebarLogo;
