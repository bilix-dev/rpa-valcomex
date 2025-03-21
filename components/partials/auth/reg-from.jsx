import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import useSWRPost from "@/hooks/useSWRPost";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import Alert from "@/components/ui/Alert";
import { getDefaultData } from "@/helpers/helper";
import CountrySelect from "@/components/ui/Selects/CountrySelect";
import Cleave from "cleave.js/react";
// import Checkbox from "@/components/ui/Checkbox";
// import { useDispatch, useSelector } from "react-redux";
// import { handleRegister } from "./store";

const RegForm = ({ token, identifier, data }) => {
  // const dispatch = useDispatch();

  const [error, setError] = useState(false);
  const { trigger } = useSWRPost("/register");
  // const [checked, setChecked] = useState(false);

  const schema = yup
    .object({
      name: yup.string().required("Nombre es requerido"),
      lastName: yup.string().required("Apellido es requerido"),
      dni: yup.string().required("DNI es requerido"),
      country: yup.string().required("País requerido"),
      phoneNumber: yup.string().notRequired().length(11, "Teléfono inválido"),
      userName: yup
        .string()
        .required("Usuario es requerido")
        .noWhiteSpaces("Usuario no debe tener espacios en blanco")
        .test(
          "username-validation",
          "Usuario ya existe en el sistema",
          async (search) => {
            const response = await getDefaultData(
              `helper/users/${data.id}?search=${search}`
            )();
            return response.data;
          }
        ),
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
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      operatorId: data.operatorId,
      roleId: data.roleId,
      email: data.email,
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  const router = useRouter();

  const onSubmit = async (payload) => {
    setError(false);
    const { data } = await trigger({ ...payload, token, identifier });
    if (data.updated) {
      await signOut({ redirect: false });
      toast.success("Usuario creado correctamente");
      router.replace("/auth");
    } else setError(!data.updated);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <div className="border border-gray-500/100 rounded  flex flex-col gap-5 p-3">
        <div>
          <label className={`block capitalize`}>Operador</label>
          <h6 className="mt-1 font-light">{data.operator.name}</h6>
        </div>
        <div>
          <label className={`block capitalize`}>Email</label>
          <h6 className="mt-1 font-light">{data.email}</h6>
        </div>
        <div>
          <label className={`block capitalize`}>Rol</label>
          <h6 className="mt-1 font-light">{data.role.name}</h6>
        </div>
      </div>
      <Textinput
        name="name"
        label="Nombre"
        type="text"
        placeholder="Nombre"
        register={register}
        error={errors.name}
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
        name="dni"
        label="DNI"
        type="text"
        placeholder="DNI"
        register={register}
        error={errors.dni}
      />

      <div className="fromGroup">
        <label className={`form-label block capitalize mb-2`}>Teléfono</label>
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
                  <div className={` mt-2 text-danger-500 block text-sm`}>
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

      <hr />
      <Textinput
        name="userName"
        label="Usuario"
        type="text"
        placeholder="Usuario"
        register={register}
        error={errors.userName}
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
      {/* <Checkbox
        label="You accept our Terms and Conditions and Privacy Policy"
        value={checked}
        onChange={() => setChecked(!checked)}
      /> */}
      <Button
        text="Crear Cuenta"
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
          No se ha creado el usuario, ha ocurrido un error.
        </Alert>
      )}
    </form>
  );
};

export default RegForm;
