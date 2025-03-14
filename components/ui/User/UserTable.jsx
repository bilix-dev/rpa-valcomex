"use client";
import BaseTable, {
  NewButton,
  RegistryInfo,
} from "@/components/partials/table/BaseTable";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Tooltip from "@/components/ui/Tooltip";
import useSWRGet from "@/hooks/useSWRGet";
import { Icon } from "@iconify/react";
import React, { Fragment, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import useSWRPost from "@/hooks/useSWRPost";
import { useSWRConfig } from "swr";
import RoleSelect from "@/components/ui/Selects/RoleSelect";
import SkeletionTable from "@/components/skeleton/Table";
import useAuth from "@/hooks/useAuth";
import useSWRDelete from "@/hooks/useSWRDelete";
import useSWRPut from "@/hooks/useSWRPut";
import LoadingIcon from "../LoadingIcon";
import Image from "next/image";
import {
  bufferToFile,
  getDefaultData,
  toFormatDateTime,
} from "@/helpers/helper";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Checkbox from "../Checkbox";
import CountrySelect from "../Selects/CountrySelect";
import Cleave from "cleave.js/react";

const Avatar = ({
  name,
  image,
  className = "lg:h-8 lg:w-8 h-7 w-7 rounded-full ",
  fallBack = "/assets/images/all-img/user-default.png",
}) => {
  return (
    <div className="flex flex-row items-center gap-5 min-w-max">
      <div className={className}>
        <Image
          src={image?.preview ?? fallBack}
          alt="Avatar"
          width={500}
          height={500}
          className="block w-full h-full object-cover rounded-full"
          onLoad={() => {
            if (image?.preview) URL.revokeObjectURL(image.preview);
          }}
        />
      </div>
      <span>{name}</span>
    </div>
  );
};

const DeleteModal = ({ data, mutate }) => {
  const { isMutating, trigger } = useSWRDelete(`/users/${data.id}`);
  return (
    <Tooltip content="Borrar" placement="top" arrow animation="fade">
      <button
        disabled={isMutating}
        className="action-btn btn-danger"
        type="button"
        onClick={async () => {
          const result = await trigger();
          if (!result) {
            toast.warning(
              "No se puede eliminar un registro que ya fue utilizado."
            );
          }
          await mutate();
        }}
      >
        <LoadingIcon icon="heroicons:trash" isLoading={isMutating} />
      </button>
    </Tooltip>
  );
};

const StatusModal = ({ data, mutate }) => {
  const { isMutating, trigger } = useSWRPut(`/users/${data.id}`);
  return (
    <Tooltip content="Estado" placement="top" arrow animation="fade">
      <button
        className="action-btn"
        type="button"
        disabled={isMutating}
        onClick={async () => {
          await trigger({ ...data, status: !data.status });
          await mutate();
        }}
      >
        <LoadingIcon
          icon="heroicons:code-bracket-square"
          isLoading={isMutating}
        />
      </button>
    </Tooltip>
  );
};

const CrudModal = ({ OpenButtonComponent, title, data, mutate }) => {
  const { operatorId } = useAuth();
  const [open, isOpen] = useState(false);

  const image = bufferToFile(data.image);

  const schema = yup
    .object({
      userName: yup
        .string()
        .required("Usuario requerido")
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
      email: yup.string().email("Correo inválido").required("Correo requerido"),
      name: yup.string().required("Nombre requerido"),
      roleId: yup.string().required("Rol requerido"),
      phoneNumber: yup.string().notRequired().length(11, "Teléfono inválido"),
    })
    .required();

  const { trigger } = useSWRPut(`/users/${data.id}`);
  const router = useRouter();
  const {
    register,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <>
      <OpenButtonComponent
        onClick={() => {
          reset({ ...data });
          isOpen(true);
        }}
      />
      <Modal
        activeModal={open}
        onClose={() => isOpen(false)}
        title={title}
        labelClass="btn-outline-dark"
        uncontrol={false}
        footerContent={
          <Button
            text="Guardar"
            form="user-form"
            type="submit"
            className="btn-outline btn-dark"
            isLoading={isSubmitting}
          />
        }
      >
        <form
          noValidate
          id="user-form"
          className="space-y-4 "
          onSubmit={handleSubmit(async (form) => {
            await trigger({ ...form, operatorId });
            await mutate();
            router.refresh();
            isOpen(false);
          })}
        >
          <div className="flex items-center gap-5">
            <div className="flex-1">
              <Textinput
                label="Usuario"
                name="userName"
                type="text"
                placeholder="Usuario"
                register={register}
                error={errors?.userName}
              />
            </div>
            <Avatar
              image={image}
              className="flex-none h-20 w-20 rounded-full"
            />
          </div>

          <Textinput
            disabled
            name="email"
            label="Correo electrónico"
            placeholder="Correo electrónico"
            type="email"
            register={register}
            error={errors?.email}
          />

          <Textinput
            label="Nombre"
            name="name"
            type="text"
            placeholder="Nombre"
            register={register}
            error={errors?.name}
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

          <Controller
            control={control}
            name="roleId"
            render={({ field: { onChange, value } }) => (
              <RoleSelect
                isDisabled={data?.role?.super}
                operatorId={operatorId}
                defaultValue={value}
                onChange={onChange}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            )}
          />

          <Checkbox
            id={`expires`}
            register={register(`expires`)}
            label={<div className=" ml-2 capitalize">Contraseña Expirable</div>}
            checked={watch(`expires`)}
          />
        </form>
      </Modal>
    </>
  );
};

const PasswordModal = ({ OpenButtonComponent, title, data, mutate }) => {
  const { operatorId } = useAuth();
  const [open, isOpen] = useState(false);

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

  const { trigger } = useSWRPut(`/users/${data.id}`);
  const router = useRouter();
  const {
    register,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <>
      <OpenButtonComponent
        onClick={() => {
          reset({ ...data });
          isOpen(true);
        }}
      />
      <Modal
        activeModal={open}
        onClose={() => isOpen(false)}
        title={title}
        labelClass="btn-outline-dark"
        uncontrol={false}
        footerContent={
          <Button
            text="Guardar"
            form="user-form"
            type="submit"
            className="btn-outline btn-dark"
            isLoading={isSubmitting}
          />
        }
      >
        <form
          noValidate
          id="user-form"
          className="space-y-4 "
          onSubmit={handleSubmit(async (form) => {
            await trigger({ ...form, operatorId });
            await mutate();
            router.refresh();
            isOpen(false);
          })}
        >
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
        </form>
      </Modal>
    </>
  );
};

const CreateModal = ({ OpenButtonComponent, title, mutate }) => {
  const { operatorId } = useAuth();
  const [open, isOpen] = useState(false);

  const schema = yup
    .object({
      userName: yup
        .string()
        .noWhiteSpaces("Usuario no debe tener espacios en blanco")
        .required("Usuario requerido")
        .test(
          "username-validation",
          "Usuario ya existe en el sistema",
          async (search) => {
            const response = await getDefaultData(
              `helper/users?search=${search}`
            )();
            return response.data;
          }
        ),
      email: yup.string().email("Correo inválido").required("Correo requerido"),
      name: yup.string().required("Nombre requerido"),
      roleId: yup.string().required("Rol requerido"),
      phoneNumber: yup.string().notRequired().length(11, "Teléfono inválido"),
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

  const { trigger } = useSWRPost(`/users`);
  const router = useRouter();
  const {
    register,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <>
      <OpenButtonComponent
        onClick={() => {
          reset();
          isOpen(true);
        }}
      />
      <Modal
        activeModal={open}
        onClose={() => isOpen(false)}
        title={title}
        labelClass="btn-outline-dark"
        uncontrol={false}
        footerContent={
          <Button
            text="Guardar"
            form="user-form"
            type="submit"
            className="btn-outline btn-dark"
            isLoading={isSubmitting}
          />
        }
      >
        <form
          noValidate
          id="user-form"
          className="space-y-4 "
          onSubmit={handleSubmit(async (form) => {
            await trigger({ ...form, operatorId });
            await mutate();
            router.refresh();
            isOpen(false);
          })}
        >
          <Textinput
            label="Usuario"
            name="userName"
            type="text"
            placeholder="Usuario"
            register={register}
            error={errors?.userName}
          />

          <Textinput
            name="email"
            label="Correo electrónico"
            placeholder="Correo electrónico"
            type="email"
            register={register}
            error={errors?.email}
          />

          <Textinput
            label="Nombre"
            name="name"
            type="text"
            placeholder="Nombre"
            register={register}
            error={errors?.name}
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

          <Controller
            control={control}
            name="roleId"
            render={({ field: { onChange, value } }) => (
              <div>
                <RoleSelect
                  operatorId={operatorId}
                  defaultValue={value}
                  onChange={onChange}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
                {errors.roleId && (
                  <div className={`mt-2 text-danger-500 block text-sm`}>
                    {errors.roleId.message}
                  </div>
                )}
              </div>
            )}
          />

          <hr />

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

          <Checkbox
            id={`expires`}
            register={register(`expires`)}
            label={<div className=" ml-2 capitalize">Contraseña Expirable</div>}
            checked={watch(`expires`)}
          />
        </form>
      </Modal>
    </>
  );
};

const UserTable = ({ mutate, ...rest }) => {
  const { userId, hasRoleAccess } = useAuth();

  const columns = useMemo(
    () => [
      {
        Header: "Opciones",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              <RegistryInfo data={row.original} />
              {hasRoleAccess("users", "edit") && (
                <>
                  <CrudModal
                    data={row.original}
                    mutate={mutate}
                    title={"Editar"}
                    OpenButtonComponent={({ onClick }) => (
                      <Tooltip
                        content="Editar"
                        placement="top"
                        arrow
                        animation="fade"
                      >
                        <button
                          className="action-btn btn-warning"
                          type="submit"
                          onClick={onClick}
                        >
                          <Icon icon="heroicons:pencil-square" />
                        </button>
                      </Tooltip>
                    )}
                  />
                  <PasswordModal
                    data={row.original}
                    mutate={mutate}
                    title={"Cambiar Contraseña"}
                    OpenButtonComponent={({ onClick }) => (
                      <Tooltip
                        content="Cambiar Contraseña"
                        placement="top"
                        arrow
                        animation="fade"
                      >
                        <button
                          className="action-btn btn-dark"
                          type="submit"
                          onClick={onClick}
                        >
                          <Icon icon="heroicons:pencil-square" />
                        </button>
                      </Tooltip>
                    )}
                  />
                  {!(row.original.role.super || userId == row.original.id) && (
                    <StatusModal data={row.original} mutate={mutate} />
                  )}
                </>
              )}

              {hasRoleAccess("users", "delete") &&
                !(row.original.role.super || userId == row.original.id) && (
                  <DeleteModal data={row.original} mutate={mutate} />
                )}
            </div>
          );
        },
      },
      {
        Header: "Nombre",
        accessor: "name",

        Cell: ({ row }) => {
          const memoImage = useMemo(
            () => bufferToFile(row.original.image),
            [row.original.image]
          );

          return <Avatar name={row.original.name} image={memoImage} />;
        },
      },
      ,
      {
        Header: "Usuario",
        accessor: "userName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Teléfono",
        accessor: "phoneNumber",
      },
      {
        Header: "Rol",
        accessor: "role.name",
      },
      {
        Header: "Maestro",
        accessor: (user) => (user.role.super ? "Si" : "No"),
        Cell: (row) => {
          return (
            <span className="block w-full">
              <span
                className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                  row?.cell?.value === "Si"
                    ? "text-primary-500 bg-primary-500"
                    : ""
                }
              ${
                row?.cell?.value === "No"
                  ? "text-secondary-500 bg-secondary-500"
                  : ""
              }`}
              >
                {row?.cell?.value}
              </span>
            </span>
          );
        },
      },
      {
        Header: "Creación",
        accessor: "createdAt",
        Cell: ({ row }) => toFormatDateTime(row.original.createdAt),
      },
      {
        Header: "Estado",
        accessor: (user) => (user.status ? "Activo" : "Inactivo"),
        Cell: (row) => {
          return (
            <span className="block w-full">
              <span
                className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                  row?.cell?.value === "Activo"
                    ? "text-primary-500 bg-primary-500"
                    : "text-secondary-500 bg-secondary-500"
                }`}
              >
                {row?.cell?.value}
              </span>
            </span>
          );
        },
      },
    ],
    []
  );

  const actionMenu = useMemo(
    () => (
      <div>
        {hasRoleAccess("users", "edit") && (
          <CreateModal
            title={"Crear"}
            OpenButtonComponent={NewButton}
            mutate={mutate}
          />
        )}
      </div>
    ),
    []
  );

  return <BaseTable ActionComponent={actionMenu} columns={columns} {...rest} />;
};

export default UserTable;
