"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import Settings from "@/components/partials/settings";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useContentWidth from "@/hooks/useContentWidth";
import useMenulayout from "@/hooks/useMenulayout";
import useMenuHidden from "@/hooks/useMenuHidden";
import Footer from "@/components/partials/footer";
// import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MobileMenu from "@/components/partials/sidebar/MobileMenu";
import useMobileMenu from "@/hooks/useMobileMenu";
import useMonoChrome from "@/hooks/useMonoChrome";
import useRtl from "@/hooks/useRtl";
import useDarkMode from "@/hooks/useDarkMode";
import useSkin from "@/hooks/useSkin";
import Loading from "@/components/Loading";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import useNavbarType from "@/hooks/useNavbarType";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import Alert from "@/components/ui/Alert";
import { useSystemData } from "@/context/AuthProvider";
import {
  dateDiff,
  dayMessage,
  passwordMessage,
  toFormatDate,
} from "@/helpers/helper";
import Link from "next/link";
import { WsProvider } from "@/context/WsProvider";

export default function DashboardRoot({ children }) {
  const { width, breakpoints } = useWidth();
  const [collapsed] = useSidebar();
  const [isRtl] = useRtl();
  const [isDark] = useDarkMode();
  const [skin] = useSkin();
  const [navbarType] = useNavbarType();
  const [isMonoChrome] = useMonoChrome();
  const router = useRouter();
  const location = usePathname();
  const { user, operator } = useSystemData();

  const dayDiff = dateDiff(new Date(), new Date(operator.expiration));
  const passwordDiff = dateDiff(new Date(), new Date(user.expiration));

  const [passwordShow, setPasswordShow] = useState(
    user.expiration
      ? passwordDiff <= process.env.NEXT_PUBLIC_PASSWORD_DAYS_LIMIT
      : false
  );

  const [show, setShow] = useState(
    operator.expiration
      ? dayDiff <= process.env.NEXT_PUBLIC_EXPIRATION_DAYS_LIMIT
      : false
  );
  // header switch class

  const switchHeaderClass = () => {
    if (menuType === "horizontal" || menuHidden) {
      return "ltr:ml-0 rtl:mr-0";
    } else if (collapsed) {
      return "ltr:ml-[72px] rtl:mr-[72px]";
    } else {
      return "ltr:ml-[248px] rtl:mr-[248px]";
    }
  };

  // content width
  const [contentWidth] = useContentWidth();
  const [menuType] = useMenulayout();
  const [menuHidden] = useMenuHidden();
  // mobile menu
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const { data } = useAuth({
    required: true,
    onUnauthenticated: () => {
      toast.warning("Se ha cerrado la sesión");
      router.refresh();
      router.replace("/auth");
    },
  });

  useEffect(() => {
    if (data && !data.user.valid) signOut({ redirect: false });
  }, [data]);

  if (data == undefined) return <Loading />;

  return (
    <WsProvider>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className={`app-warp    ${isDark ? "dark" : "light"} ${
          skin === "bordered" ? "skin--bordered" : "skin--default"
        }
      ${navbarType === "floating" ? "has-floating" : ""}
      `}
      >
        <Header className={width > breakpoints.xl ? switchHeaderClass() : ""} />
        {menuType === "vertical" && width > breakpoints.xl && !menuHidden && (
          <Sidebar />
        )}
        <MobileMenu
          className={`${
            width < breakpoints.xl && mobileMenu
              ? "left-0 visible opacity-100  z-[9999]"
              : "left-[-300px] invisible opacity-0  z-[-999] "
          }`}
        />
        {/* mobile menu overlay*/}
        {width < breakpoints.xl && mobileMenu && (
          <div
            className="overlay bg-slate-900/50 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]"
            onClick={() => setMobileMenu(false)}
          ></div>
        )}
        <Settings />
        <div
          className={`content-wrapper transition-all duration-150 ${
            width > 1280 ? switchHeaderClass() : ""
          }`}
        >
          {/* md:min-h-screen will h-full*/}
          <div className="page-content   page-min-height  ">
            <div
              className={
                contentWidth === "boxed"
                  ? "container mx-auto"
                  : "container-fluid"
              }
            >
              <motion.div
                key={location}
                initial="pageInitial"
                animate="pageAnimate"
                exit="pageExit"
                variants={{
                  pageInitial: {
                    opacity: 0,
                    y: 50,
                  },
                  pageAnimate: {
                    opacity: 1,
                    y: 0,
                  },
                  pageExit: {
                    opacity: 0,
                    y: -50,
                  },
                }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.5,
                }}
              >
                <Suspense fallback={<Loading />}>
                  {show && (
                    <Alert
                      toggle={() => setShow(!show)}
                      icon="akar-icons:triangle-alert"
                      className="light-mode alert-warning mb-5"
                    >
                      {`La subscripción expira el día ${toFormatDate(
                        operator.expiration
                      )}. ${dayMessage(dayDiff)}`}
                    </Alert>
                  )}
                  {passwordShow && (
                    <Alert
                      toggle={() => setPasswordShow(!passwordShow)}
                      icon="akar-icons:triangle-alert"
                      className="light-mode alert-warning mb-5"
                    >
                      {`La contraseña expira el día ${toFormatDate(
                        user.expiration
                      )}. Puede cambiar la contraseña desde el `}

                      <Link
                        href="/profile"
                        className="font-bold italic underline"
                      >
                        perfil
                      </Link>
                      {` de usuario. ${passwordMessage(passwordDiff)}`}
                    </Alert>
                  )}

                  <Breadcrumbs />
                  {children}
                </Suspense>
              </motion.div>
            </div>
          </div>
        </div>
        {/* {width < breakpoints.md && <MobileFooter />} */}
        {/* {width > breakpoints.md && (
          <Footer
            className={width > breakpoints.xl ? switchHeaderClass() : ""}
          />
        )} */}
        <Footer className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      </div>
    </WsProvider>
  );
}
