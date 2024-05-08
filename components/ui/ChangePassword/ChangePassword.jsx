"use client";

import React, { useState } from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import Alert from "@/components/ui/Alert";
import { signOut } from "next-auth/react";
import Textinput from "@/components/ui/Textinput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import useSWRPut from "@/hooks/useSWRPut";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import LeftSide from "@/components/partials/LeftSide";

const ChangePassword = ({ user, operator }) => {
  const [isDark] = useDarkMode();
  const [error, setError] = useState(false);
  const { trigger } = useSWRPut("/reset/reset-password");
  const router = useRouter();
  const { update } = useAuth();

  const schema = yup
    .object({
      password: yup
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("Contraseña es requerida"),
      // confirm password
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("password"), null],
          "Las contraseñas deben ser iguales"
        ),
    })
    .required();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async (payload) => {
    setError(false);
    const { data } = await trigger({ ...payload, userId: user.id });

    if (data.updated) {
      await update({ userId: user.id });
      toast.success("Contraseña actualizada");
      router.replace("/auth");
    } else setError(!data.updated);
  };

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
                <h4 className="font-medium mb-4">Actualizar la Contraseña</h4>
                <div className="text-slate-500 dark:text-slate-400 text-base">
                  Falta poco...
                </div>
              </div>
              <div>
                <form
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 "
                >
                  <div className="border border-gray-500/100 rounded  flex flex-col gap-5 p-3">
                    <div>
                      <label className={`block capitalize`}>Operador</label>
                      <h6 className="mt-1 font-light">{operator.name}</h6>
                    </div>
                    <div>
                      <label className={`block capitalize`}>Usuario</label>
                      <h6 className="mt-1 font-light">{user.name}</h6>
                    </div>
                    <div>
                      <label className={`block capitalize`}>Email</label>
                      <h6 className="mt-1 font-light">{user.email}</h6>
                    </div>
                  </div>
                  <Textinput
                    name="oldPassword"
                    label="Antigua Contraseña"
                    type="password"
                    placeholder="Contraseña"
                    register={register}
                    error={errors.oldPassword}
                  />
                  <Textinput
                    name="password"
                    label="Contraseña"
                    type="password"
                    placeholder="Contraseña"
                    register={register}
                    error={errors.password}
                  />
                  <Textinput
                    name="confirmPassword"
                    label="Repita Contraseña"
                    type="password"
                    placeholder="Repita Contraseña"
                    register={register}
                    error={errors.confirmPassword}
                  />
                  <Button
                    text="Cambiar Contraseña"
                    type="submit"
                    isLoading={isSubmitting}
                    className="btn btn-dark block w-full text-center"
                  />
                  {error && (
                    <Alert
                      toggle={() => setError(false)}
                      icon="heroicons-outline:support"
                      className=" light-mode alert-danger mt-4"
                    >
                      Ha ocurrido un error. Asegúrese que la contraseña anterior
                      sea la correcta.
                    </Alert>
                  )}
                </form>
              </div>

              <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-8 uppercase text-sm">
                Olvídalo,
                <a
                  onClick={async () => await signOut({ callbackUrl: "/auth" })}
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                  style={{ cursor: "pointer" }}
                >
                  volver
                </a>{" "}
                a la pantalla de inicio
              </div>
            </div>
            <div className="auth-footer text-center">
              &copy; {new Date().getFullYear()}, Bilix Ingeniería.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
