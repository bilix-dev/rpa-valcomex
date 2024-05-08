import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Alert from "@/components/ui/Alert";
import useSWRPost from "@/hooks/useSWRPost";
import Button from "@/components/ui/Button";

const schema = yup
  .object({
    operatorCode: yup.string().required("Operador requerido"),
    email: yup
      .string()
      .email("Correo invalida")
      .required("Correo es requerido"),
  })
  .required();
const ForgotPass = () => {
  const { trigger } = useSWRPost("/reset/send-verification");
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [status, setStatus] = useState(false);

  const onSubmit = async (data) => {
    setStatus(false);
    const response = await trigger(data);
    setStatus(true);
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <Textinput
          name="operatorCode"
          label="Operador"
          placeholder="Operador"
          type="text"
          register={register}
          error={errors?.operatorCode}
        />

        <Textinput
          name="email"
          label="Correo Electrónico"
          type="email"
          placeholder="Correo electrónico"
          register={register}
          error={errors.email}
        />

        <Button
          text="Enviar"
          type="submit"
          isLoading={isSubmitting}
          className="btn btn-dark block w-full text-center"
        />
      </form>
      {status && (
        <Alert
          toggle={() => setStatus(false)}
          icon="heroicons-outline:support"
          className=" light-mode alert-secondary mt-4"
        >
          Se ha enviado el correo de recuperación, revise su bandeja de entrada.
        </Alert>
      )}
    </>
  );
};

export default ForgotPass;
