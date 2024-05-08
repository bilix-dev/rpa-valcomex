"use client";

import React from "react";
import Link from "next/link";
import ForgotPass from "@/components/partials/auth/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";
import LeftSide from "@/components/partials/LeftSide";

const ForgotPassPage = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-[1]">
          <LeftSide isDark={isDark} />
        </div>
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box2 flex flex-col justify-center h-full">
              <div className="mobile-logo mb-6 lg:hidden block grid place-items-center">
                <Link href="/">
                  <img
                    src={
                      isDark
                        ? "/assets/images/logo-full-white.png"
                        : "/assets/images/logo-full-black.png"
                    }
                    alt=""
                    width={150}
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <h4 className="font-medium mb-4">¿Olvidó su contraseña?</h4>
                <div className="text-slate-500 dark:text-slate-400 text-base">
                  No se preocupe, a todos nos puede pasar.
                </div>
              </div>
              <div className="font-normal text-base text-slate-500 dark:text-slate-400 text-center px-2 bg-slate-100 dark:bg-slate-600 rounded py-3 mb-4 mt-10">
                Ingrese su correo electrónico y operador, y se le enviarán las
                instrucciones para cambiar la contraseña.
              </div>

              <ForgotPass />
              <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-8 uppercase text-sm">
                Olvídalo,
                <Link
                  href="/auth"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  volver
                </Link>{" "}
                a la pantalla de inicio
              </div>
            </div>
            <div className="auth-footer text-center">
              &copy; {new Date().getFullYear()} Bilix Ingenieria.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
