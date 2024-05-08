"use client";

import useRtl from "@/hooks/useRtl";
import useDarkMode from "@/hooks/useDarkMode";

export default function AuthLayout({ children }) {
  const [isRtl] = useRtl();
  const [isDark] = useDarkMode();
  return (
    <>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className={`app-warp ${isDark ? "dark" : "light"} skin--bordered`}
      >
        {children}
      </div>
    </>
  );
}
