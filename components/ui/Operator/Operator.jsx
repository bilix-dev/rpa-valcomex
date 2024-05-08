"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import useSWRPut from "@/hooks/useSWRPut";
import Alert from "@/components/ui/Alert";
import Cleave from "cleave.js/react";
import { useRouter } from "next/navigation";
import { useSystemData } from "@/context/AuthProvider";

const Operator = () => {
  const { operator: data } = useSystemData();
  const [show, setShow] = useState(false);
  const router = useRouter();

  const { trigger } = useSWRPut(`/operators/${data.id}`);

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
    defaultValues: data,
    resolver: yupResolver(schema),
  });

  return (
    <Card title="Operador">
      <form
        noValidate
        onSubmit={handleSubmit(async (data) => {
          setShow(false);
          const response = await trigger(data);
          router.refresh();
          if (response) setShow(true);
        })}
      >
        <div className="space-y-3">
          {show && (
            <Alert
              toggle={() => setShow(!show)}
              icon="akar-icons:double-check"
              className="light-mode alert-success"
            >
              Operador actualizado correctamente.
            </Alert>
          )}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="fromGroup">
              <label className={`form-label block capitalize mb-2`}>Rut</label>
              <Controller
                control={control}
                name={"rut"}
                render={({ field: { value, onChange } }) => {
                  return (
                    <>
                      <Cleave
                        disabled={true}
                        placeholder="Rut Operador"
                        value={value}
                        onChange={(e) => onChange(e.target.rawValue)}
                        options={{
                          delimiters: [".", ".", "-"],
                          blocks: [2, 3, 3, 1],
                          uppercase: true,
                        }}
                        className={`form-control py-2 ${
                          errors?.rut
                            ? " border-danger-500 focus:ring-danger-500  focus:ring-opacity-90 focus:ring-1"
                            : ""
                        } `}
                      />
                      {errors?.rut && (
                        <div className={` mt-2 text-danger-500 block text-sm`}>
                          {errors?.rut.message}
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </div>

            <Textinput
              label="Nombre Operador"
              type="text"
              placeholder="Nombre operador"
              name={"name"}
              register={register}
              error={errors?.name}
            />
          </div>

          <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
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

export default Operator;
