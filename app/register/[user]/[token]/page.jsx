"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import RegForm from "@/components/partials/auth/reg-from";
import Social from "@/components/partials/auth/social";
import { usePathname } from "next/navigation";
import useSWRGet from "@/hooks/useSWRGet";
import Loading from "@/app/loading";
import Alert from "@/components/ui/Alert";
import LeftSide from "@/components/partials/LeftSide";

const Register = () => {
  const [isDark] = useDarkMode();
  const pathname = usePathname();
  const { identifier, token } = useMemo(() => {
    const split = pathname.split("/");
    return {
      identifier: split[2],
      token: split[3],
    };
  }, [pathname]);

  const { data: response, isLoading } = useSWRGet([
    `/register/check-token`,
    {
      identifier,
      token,
    },
  ]);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <LeftSide isDark={isDark} />
          </div>
          <div className="right-column relative bg-white dark:bg-slate-800">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
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
                  <h4 className="font-medium">Registrarse</h4>
                  <div className="text-slate-500 dark:text-slate-400 text-base">
                    Crear una cuenta con nosotros.
                  </div>
                </div>
                {response?.data?.status?.valid &&
                !Boolean(response?.data?.data?.inUse) ? (
                  <RegForm
                    token={token}
                    identifier={identifier}
                    data={response.data?.data}
                  />
                ) : (
                  <Alert
                    icon="heroicons-outline:exclamation"
                    className=" light-mode alert-danger"
                  >
                    El link de creación de cuenta se encuentra vencido o es
                    inválido.
                  </Alert>
                )}
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
    </>
  );
};

export default Register;
