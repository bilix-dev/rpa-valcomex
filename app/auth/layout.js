"use client";

import useRtl from "@/hooks/useRtl";
import useDarkMode from "@/hooks/useDarkMode";
import useSkin from "@/hooks/useSkin";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const [isRtl] = useRtl();
  const [isDark] = useDarkMode();
  const [skin] = useSkin();
  const router = useRouter();
  return (
    <>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className={`app-warp ${isDark ? "dark" : "light"} $skin--default`}
      >
        {children}
      </div>
    </>
  );
}
