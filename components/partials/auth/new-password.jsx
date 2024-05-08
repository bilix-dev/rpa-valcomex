import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Alert from "@/components/ui/Alert";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useSWRPost from "@/hooks/useSWRPost";
import Button from "@/components/ui/Button";

const schema = yup
  .object({
    password: yup.string().required("Contraseña es requerida"),
    confirmPassword: yup
      .string()
      .required("Contraseña es requerida")
      .oneOf([yup.ref("password"), null], "Las contraseñas deben ser iguales"),
  })
  .required();

const NewPassword = ({ token, identifier }) => {
  const { trigger } = useSWRPost("/reset/reset-password");
  const [error, setError] = useState(false);
  const router = useRouter();
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (payload) => {
    setError(false);
    const { data } = await trigger({ ...payload, token, identifier });

    if (data.updated) {
      toast.success("Contraseña actualizada");
      router.replace("/auth");
    } else setError(!data.updated);
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textinput
          name="password"
          label="Nueva Contraseña"
          type="password"
          placeholder="Nueva contraseña"
          register={register}
          error={errors.password}
        />

        <Textinput
          name="confirmPassword"
          label="Repita Contraseña"
          type="password"
          placeholder="Repita contraseña"
          register={register}
          error={errors.confirmPassword}
        />

        <Button
          text="Cambiar Contraseña"
          type="submit"
          isLoading={isSubmitting}
          className="btn btn-dark block w-full text-center"
        />
      </form>
      {error && (
        <Alert
          toggle={() => setError(false)}
          icon="heroicons-outline:support"
          className=" light-mode alert-danger mt-4"
        >
          No se ha actualizado la contraseña, ha ocurrido un error.
        </Alert>
      )}
    </>
  );
};

export default NewPassword;
