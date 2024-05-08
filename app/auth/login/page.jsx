"use client";
import Link from "next/link";
import LoginForm from "@/components/partials/auth/login-form";
import useDarkMode from "@/hooks/useDarkMode";
import LeftSide from "@/components/partials/LeftSide";

// image import

const Login = () => {
  const [isDark] = useDarkMode();
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <LeftSide isDark={isDark} />
          </div>
          <div className="right-column relative">
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
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Iniciar Sesión</h4>
                  <div className="text-slate-500 text-base">Bienvenido</div>
                </div>
                <LoginForm />
                {/* <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                  <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                    Or continue with
                  </div>
                </div>
                <div className="max-w-[242px] mx-auto mt-8 w-full">
                  <Social />
                </div> */}
                {/* <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                  ¿No tiene cuenta?{" "}
                  <Link
                    href="/auth/register"
                    className="text-slate-900 dark:text-white font-medium hover:underline"
                  >
                    Registrarse
                  </Link>
                </div> */}
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

export default Login;
