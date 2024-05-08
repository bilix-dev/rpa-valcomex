"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import useSWRPut from "@/hooks/useSWRPut";
import DropZone from "@/components/partials/froms/DropZone";
import {
  bufferToFile,
  dateDiff,
  fileToBuffer,
  passwordMessage,
} from "@/helpers/helper";
import { useSWRConfig } from "swr";
import Alert from "@/components/ui/Alert";
import useSWRPost from "@/hooks/useSWRPost";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useSystemData } from "@/context/AuthProvider";

const Profile = () => {
  const { user: data, operator } = useSystemData();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { update } = useAuth();

  const handleChangePassword = async () => {
    setShowPassword(false);
    await triggerPassword({
      email: data?.email,
      operatorCode: operator?.code,
    });
    setShowPassword(true);
  };

  const [show, setShow] = useState(false);

  const { trigger } = useSWRPut(`/users/${data.id}`);
  const { trigger: triggerPassword, isMutating } = useSWRPost(
    "/reset/send-verification"
  );

  const { mutate } = useSWRConfig();

  const schema = yup
    .object({
      name: yup.string().required("Nombre requerido"),
    })
    .required();

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: { ...data, image: bufferToFile(data?.image) },
    resolver: yupResolver(schema),
  });

  return (
    <Card title={"Perfil"}>
      <form
        noValidate
        onSubmit={handleSubmit(async (data) => {
          setShow(false);
          await trigger({ ...data, image: await fileToBuffer(data.image) });
          await mutate([`/users/${data.id}`]);
          await update({ userId: data.id });
          router.refresh();
          setShow(true);
        })}
      >
        <div className="space-y-3">
          {showPassword && (
            <Alert
              toggle={() => setShowPassword(!showPassword)}
              icon="heroicons-outline:support"
              className=" light-mode alert-secondary"
            >
              Se ha enviado un correo a{" "}
              <span className="font-light text-primary-500 italic">
                {data?.user?.email}{" "}
              </span>
              con instrucciones para el cambio de contraseña, revise su bandeja
              de entrada.
            </Alert>
          )}

          {show && (
            <Alert
              toggle={() => setShow(!show)}
              icon="akar-icons:double-check"
              className="light-mode alert-success"
            >
              Usuario actualizado correctamente.
            </Alert>
          )}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="grid gap-5">
              <Textinput
                label="Nombre"
                type="text"
                placeholder="Nombre"
                name={"name"}
                register={register}
                error={errors?.name}
              />
              <Textinput
                disabled={true}
                label="Usuario"
                type="text"
                placeholder="Nombre"
                name={"userName"}
                register={register}
              />
              <Textinput
                disabled={true}
                label="Correo Electrónico"
                type="text"
                placeholder="Correo Electrónico"
                name={"email"}
                register={register}
              />
            </div>
            <div>
              <label className={`form-label block capitalize mb-2`}>
                Avatar
              </label>
              <Controller
                control={control}
                name={"image"}
                render={({ field: { value, onChange } }) => {
                  return (
                    <DropZone
                      defaultValue={value ? [value] : []}
                      onChange={async (e) =>
                        onChange(e.length > 0 ? e[0] : null)
                      }
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className="px-4 py-3 space-x-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <div className="flex flex-col">
              <Button
                isLoading={isMutating}
                text={"¿Desea cambiar su contraseña?"}
                className="btn-link"
                onClick={handleChangePassword}
              />
              <div className="italic text-sm">
                {passwordMessage(
                  dateDiff(new Date(), new Date(data.expiration))
                )}
              </div>
            </div>
            <Button
              type="submit"
              text="Guardar"
              isLoading={isSubmitting}
              className="btn btn-dark"
            />
          </div>
        </div>
      </form>
    </Card>
  );
};

export default Profile;