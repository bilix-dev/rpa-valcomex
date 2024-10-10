"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import { usePathname } from "next/navigation";
import Alert from "@/components/ui/Alert";
import NewPassword from "@/components/partials/auth/new-password";
import useSWRGet from "@/hooks/useSWRGet";
import Loading from "@/app/loading";
import LeftSide from "@/components/partials/LeftSide";

const ForgotPassPage = () => {
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
    `/reset/check-token`,
    {
      identifier,
      token,
    },
  ]);

  if (isLoading) return <Loading />;
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
                <h4 className="font-medium mb-4">Reestablecer Contraseña</h4>
                <div className="text-slate-500 dark:text-slate-400 text-base">
                  Falta poco...
                </div>
              </div>
              {response.data.valid ? (
                <>
                  <div className="border border-gray-500/100 rounded  flex flex-col gap-5 p-3">
                    <div>
                      <label className={`block capitalize`}>Rol</label>
                      <h6 className="mt-1 font-light">
                        {response.data.user.role.name}
                      </h6>
                    </div>
                    <div>
                      <label className={`block capitalize`}>Email</label>
                      <h6 className="mt-1 font-light">
                        {response.data.user.email}
                      </h6>
                    </div>
                    <div>
                      <label className={`block capitalize`}>Usuario</label>
                      <h6 className="mt-1 font-light">
                        {response.data.user.userName}
                      </h6>
                    </div>
                  </div>
                  <div className="font-normal text-base text-slate-500 dark:text-slate-400 text-center px-2 bg-slate-100 dark:bg-slate-600 rounded py-3 mb-4 mt-10">
                    La contraseña debe ser segura
                  </div>

                  <NewPassword identifier={identifier} token={token} />
                </>
              ) : (
                <Alert
                  icon="heroicons-outline:exclamation"
                  className=" light-mode alert-danger"
                >
                  El link de recuperación se encuentra vencido o es inválido.
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
              Copyright {new Date().getFullYear()}, Bilix Ingeniería.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
