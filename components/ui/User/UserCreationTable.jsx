"use client";
import BaseTable, {
  NewButton,
  RegistryInfo,
} from "@/components/partials/table/BaseTable";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Tooltip from "@/components/ui/Tooltip";
import { Icon } from "@iconify/react";
import React, { Fragment, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import useSWRPost from "@/hooks/useSWRPost";
import RoleSelect from "@/components/ui/Selects/RoleSelect";

import useAuth from "@/hooks/useAuth";
import useSWRDelete from "@/hooks/useSWRDelete";
import { getDefaultData, toFormatDateTime } from "@/helpers/helper";
import useSWRPut from "@/hooks/useSWRPut";
import LoadingIcon from "../LoadingIcon";
import { toast } from "react-toastify";

const DeleteModal = ({ data, mutate }) => {
  const { isMutating, trigger } = useSWRDelete(
    `/users/verification/${data.id}`
  );
  return (
    <Tooltip content="Borrar" placement="top" arrow animation="fade">
      <button
        disabled={isMutating}
        className="action-btn  btn-danger"
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

const RefreshModal = ({ data, mutate }) => {
  const { isMutating, trigger } = useSWRPut(`/users/verification/${data.id}`);
  return (
    <Tooltip content="Reenviar" placement="top" arrow animation="fade">
      <button
        disabled={isMutating}
        className="action-btn"
        type="button"
        onClick={async () => {
          await trigger();
          await mutate();
        }}
      >
        <LoadingIcon icon="heroicons:arrow-path" isLoading={isMutating} />
      </button>
    </Tooltip>
  );
};

const CrudModal = ({ OpenButtonComponent, title, mutate }) => {
  const { operatorId } = useAuth();
  const [open, isOpen] = useState(false);
  const schema = yup
    .object({
      roleId: yup.string().required("Rol requerido"),
      email: yup
        .string()
        .email("Correo inválido")
        .required("Correo requerido")
        .test(
          "email.validation",
          "Correo pertenece a otro usuario",
          async (code) => {
            const response = await getDefaultData(
              `/users?operatorId=${operatorId}&email=${code}`
            )();
            return !response.data;
          }
        ),
    })
    .required();

  const { trigger } = useSWRPost(`/users/verification`);

  const {
    register,
    reset,
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
            isOpen(false);
          })}
        >
          <Textinput
            name="email"
            label="Correo electrónico"
            placeholder="Correo electrónico"
            type="email"
            register={register}
            error={errors?.email}
          />

          <Controller
            control={control}
            name="roleId"
            render={({ field: { onChange } }) => (
              <div>
                <RoleSelect operatorId={operatorId} onChange={onChange} />
                {errors.roleId && (
                  <div className={`mt-2 text-danger-500 block text-sm`}>
                    {errors.roleId.message}
                  </div>
                )}
              </div>
            )}
          />
        </form>
      </Modal>
    </>
  );
};

const UserCreationTable = ({ mutate, ...rest }) => {
  const { hasRoleAccess } = useAuth();
  const columns = useMemo(
    () => [
      {
        Header: "Opciones",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => {
          let notValid = Boolean(row.original.inUse);
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              <RegistryInfo data={row.original} />
              {!notValid && hasRoleAccess("users", "edit") && (
                <RefreshModal data={row.original} mutate={mutate} />
              )}
              {hasRoleAccess("users", "delete") && (
                <DeleteModal data={row.original} mutate={mutate} />
              )}
            </div>
          );
        },
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Rol",
        accessor: "role.name",
      },
      {
        Header: "Envío",
        accessor: "updatedAt",
        Cell: ({ value }) => toFormatDateTime(value),
      },
      {
        Header: "Expiración",
        accessor: "expires",
        Cell: ({ value }) => toFormatDateTime(value),
      },
      {
        Header: "Validez",
        accessor: "validation",
        Cell: ({ row }) => {
          let notValid = Boolean(row.original.inUse);

          return (
            <span className="block w-full">
              <span
                className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                  notValid ? "text-danger-500 bg-danger-500" : ""
                }
              ${!notValid ? "text-success-500 bg-success-500" : ""}`}
              >
                {notValid ? "Inválido" : "Válido"}
              </span>
            </span>
          );
        },
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ row }) => {
          let now = new Date();
          let expires = new Date(row.original.expires);

          return (
            <span className="block w-full">
              <span
                className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                  expires <= now ? "text-danger-500 bg-danger-500" : ""
                }
              ${expires > now ? "text-warning-500 bg-warning-500" : ""}`}
              >
                {expires <= now ? "Vencido" : "Pendiente"}
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
          <CrudModal
            title={"Crear"}
            OpenButtonComponent={NewButton}
            mutate={mutate}
          />
        )}
      </div>
    ),
    []
  );

  return (
    <BaseTable
      columns={columns}
      creatable={true}
      ActionComponent={actionMenu}
      {...rest}
    />
  );
};

export default UserCreationTable;
