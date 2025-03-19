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
import CountrySelect from "../Selects/CountrySelect";
import Cleave from "cleave.js/react";

const Profile = () => {
  const { user: data } = useSystemData();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { update } = useAuth();

  const handleChangePassword = async () => {
    setShowPassword(false);
    await triggerPassword({
      email: data?.email,
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
      lastName: yup.string().required("Apellido requerido"),
      dni: yup.string().required("DNI requerido"),
      country: yup.string().required("País requerido"),
      phoneNumber: yup.string().notRequired().length(11, "Teléfono inválido"),
    })
    .required();

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: { ...data, image: bufferToFile(data?.image) },
    resolver: yupResolver(schema),
  });

  console.log(watch());

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
                disabled={true}
                label="Usuario"
                type="text"
                placeholder="Nombre"
                name={"userName"}
                register={register}
              />
              <Textinput
                disabled={data?.emailVerified}
                label="Correo Electrónico"
                type="text"
                placeholder="Correo Electrónico"
                name={"email"}
                register={register}
              />
              <Textinput
                label="Nombre"
                type="text"
                placeholder="Nombre"
                name={"name"}
                register={register}
                error={errors?.name}
              />
              <Textinput
                label="Apellido"
                type="text"
                placeholder="Apellido"
                name={"lastName"}
                register={register}
                error={errors?.lastName}
              />
              <Textinput
                label="DNI"
                type="text"
                placeholder="DNI"
                name={"dni"}
                register={register}
                error={errors?.dni}
              />
              <div className="fromGroup">
                <label className={`form-label block capitalize mb-2`}>
                  Teléfono
                </label>
                <Controller
                  control={control}
                  name={"phoneNumber"}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <>
                        <Cleave
                          placeholder="Teléfono"
                          options={{
                            numericOnly: true,
                            blocks: [3, 3, 3, 2],
                            delimiters: [" ", " ", " "],
                          }}
                          value={value}
                          onChange={(e) =>
                            onChange(
                              e.target.rawValue.length > 0
                                ? e.target.rawValue
                                : undefined
                            )
                          }
                          className={`form-control py-2 ${
                            errors?.phoneNumber
                              ? " border-danger-500 focus:ring-danger-500  focus:ring-opacity-90 focus:ring-1"
                              : ""
                          } `}
                        />
                        {errors?.phoneNumber && (
                          <div
                            className={` mt-2 text-danger-500 block text-sm`}
                          >
                            {errors?.phoneNumber.message}
                          </div>
                        )}
                      </>
                    );
                  }}
                />
              </div>
              <Controller
                control={control}
                name="country"
                render={({ field: { value, onChange } }) => (
                  <div>
                    <CountrySelect defaultValue={value} onChange={onChange} />
                    {errors.country && (
                      <div className={`mt-2 text-danger-500 block text-sm`}>
                        {errors.country.message}
                      </div>
                    )}
                  </div>
                )}
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
                {data.expires
                  ? passwordMessage(
                      dateDiff(new Date(), new Date(data.expiration))
                    )
                  : "Contraseña no expirable."}
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
