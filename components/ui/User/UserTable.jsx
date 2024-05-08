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
import { bufferToFile, toFormatDateTime } from "@/helpers/helper";
import { toast } from "react-toastify";

const Avatar = ({
  name,
  image,
  className = "lg:h-8 lg:w-8 h-7 w-7 rounded-full",
  fallBack = "/assets/images/all-img/user-default.png",
}) => {
  return (
    <div className="flex items-center gap-5">
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
      email: yup.string().email("Correo inválido").required("Correo requerido"),
      name: yup.string().required("Nombre requerido"),
      roleId: yup.string().required("Rol requerido"),
    })
    .required();

  const { trigger } = useSWRPut(`/users/${data.id}`);

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
            isOpen(false);
          })}
        >
          <div className="flex items-center gap-5">
            <div className="flex-1">
              <Textinput
                label="Nombre"
                name="name"
                type="text"
                placeholder="Nombre"
                register={register}
                error={errors?.name}
              />
            </div>
            <Avatar
              image={image}
              className="flex-none h-20 w-20 rounded-full"
            />
          </div>

          <Textinput
            disabled={data.id != null}
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
            render={({ field: { onChange, value } }) => (
              <RoleSelect
                isDisabled={data?.role?.super}
                operatorId={operatorId}
                defaultValue={value}
                onChange={onChange}
              />
            )}
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
          if (row.original.role.super || userId == row.original.id)
            return <RegistryInfo data={row.original} />;
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
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
                  <StatusModal data={row.original} mutate={mutate} />
                </>
              )}
              {hasRoleAccess("users", "delete") && (
                <DeleteModal data={row.original} mutate={mutate} />
              )}
              <RegistryInfo data={row.original} />
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

  return <BaseTable columns={columns} {...rest} />;
};

export default UserTable;
