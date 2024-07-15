"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import useSWRPut from "@/hooks/useSWRPut";
import Alert from "@/components/ui/Alert";
import Cleave from "cleave.js/react";
import { useRouter } from "next/navigation";
import { useSystemData } from "@/context/AuthProvider";
import Tooltip from "../Tooltip";
import { Icon } from "@iconify/react";

const Operator = () => {
  const { operator: data } = useSystemData();
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { trigger } = useSWRPut(`/operators/${data.id}`);

  const schema = yup
    .object({
      name: yup.string().required("Nombre requerido"),
      rpas: yup.array().of(
        yup.object().shape({
          userName: yup.string().required("Necesario"),
          password: yup.string().required("Necesario"),
        })
      ),
    })
    .required();

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    clearErrors,
  } = useForm({
    mode: "all",
    defaultValues: {
      ...data,
      rpas: data.rpas.map((x) => ({ ...x, formStatus: false })),
    },
    resolver: yupResolver(schema),
  });

  const { fields, update } = useFieldArray({
    keyName: "rpaId",
    name: "rpas",
    control,
  });

  return (
    <Card title="Operador">
      <form
        noValidate
        onSubmit={handleSubmit(async (data) => {
          if (watch("rpas").some((x) => x.formStatus)) return;
          setShow(false);
          const response = await trigger({
            ...data,
            rpas: data.rpas.map((rpa) => ({
              id: rpa.id,
              userName: rpa.userName,
              password: rpa.password,
            })),
          });
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
          <div className="grid md:grid-cols-3 gap-5">
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

            <Textinput
              label="Código Tarifa"
              type="text"
              placeholder="Código Tarifa"
              name={"tariffCode"}
              register={register}
            />
          </div>
          <label className={`form-label block capitalize`}>Rpas</label>
          <div className="overflow-x-auto ">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                  <thead className="bg-slate-200 dark:bg-slate-700">
                    <tr>
                      <th scope="col" className=" table-th ">
                        Nombre
                      </th>
                      <th scope="col" className=" table-th ">
                        Código
                      </th>
                      <th scope="col" className=" table-th ">
                        Usuario
                      </th>
                      <th scope="col" className=" table-th ">
                        Contraseña
                      </th>
                      <th scope="col" className=" table-th ">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                    {fields.map((row, i) => (
                      <tr
                        key={i}
                        className=" even:bg-slate-200 dark:even:bg-slate-700"
                      >
                        <td className="table-td normal-case">{row.name}</td>
                        <td className="table-td normal-case">{row.code}</td>
                        {row.formStatus ? (
                          <>
                            <td className="table-td normal-case">
                              <Textinput
                                name={`rpas.${i}.userName`}
                                register={register}
                                placeholder="Usuario"
                                className="form-control py-2"
                                error={errors.rpas?.[i]?.userName}
                                msgTooltip={true}
                              />
                            </td>
                            <td className="table-td normal-case">
                              <Textinput
                                name={`rpas.${i}.password`}
                                register={register}
                                placeholder="Contraseña"
                                className="form-control py-2"
                                error={errors.rpas?.[i]?.password}
                                msgTooltip={true}
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="table-td normal-case text-green-500 font-bold">
                              {row.userName}
                            </td>
                            <td className="table-td normal-case text-green-500 font-bold">
                              *********
                            </td>
                          </>
                        )}

                        <td className="table-td">
                          <div className="flex justify-center flex-row gap-2">
                            {row.formStatus ? (
                              <>
                                <Tooltip
                                  content="Cancelar"
                                  placement="top"
                                  arrow
                                  animation="fade"
                                >
                                  <button
                                    className="action-btn btn-danger"
                                    onClick={() => {
                                      update(i, { ...row, formStatus: false });
                                      clearErrors("rpas");
                                    }}
                                    type="button"
                                  >
                                    <Icon icon="heroicons:x-mark" />
                                  </button>
                                </Tooltip>
                                <Tooltip
                                  content="Aceptar"
                                  placement="top"
                                  arrow
                                  animation="fade"
                                >
                                  <button
                                    disabled={errors.rpas?.[i]}
                                    className={`action-btn ${
                                      errors.rpas?.[i]
                                        ? "btn-secondary"
                                        : "btn-success"
                                    } `}
                                    onClick={() => {
                                      update(i, {
                                        ...watch(`rpas.${i}`),
                                        formStatus: false,
                                      });
                                    }}
                                    type="button"
                                  >
                                    <Icon icon="heroicons:check" />
                                  </button>
                                </Tooltip>
                              </>
                            ) : (
                              <Tooltip
                                content="Editar"
                                placement="top"
                                arrow
                                animation="fade"
                              >
                                <button
                                  className="action-btn btn-warning"
                                  onClick={() => {
                                    update(i, { ...row, formStatus: true });
                                  }}
                                  type="button"
                                >
                                  <Icon icon="heroicons:pencil-square" />
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <Button
              disabled={watch("rpas").some((x) => x.formStatus)}
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
