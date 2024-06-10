"use client";
import BaseTable, {
  NewButton,
  RegistryInfo,
} from "@/components/partials/table/BaseTable";
import useSWRGet from "@/hooks/useSWRGet";
import React, { useMemo, useState } from "react";
import SkeletionTable from "@/components/skeleton/Table";
import useAuth from "@/hooks/useAuth";
import {
  CONTAINER_STATUS,
  OS_STATUS,
  toFormatDateTime,
} from "@/helpers/helper";
import { DateFilter, Filter } from "@/components/partials/table/Filters";
import Tooltip from "../Tooltip";
import Link from "next/link";
import Badge from "../Badge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import { Icon } from "@iconify/react";
import { DeleteModal } from "@/components/partials/modal/Modals";
import { useSWRConfig } from "swr";
import useSWRPut from "@/hooks/useSWRPut";
import useSWRPost from "@/hooks/useSWRPost";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import Textinput from "../Textinput";
import ExcelModal from "../ExcelModal";
import CellOsStatus from "../CellOsStatus";
import CellBoolStatus from "../CellBoolStatus";
import LoadingIcon from "../LoadingIcon";

const StatusModal = ({ data, mutation }) => {
  const { operatorId } = useAuth();
  const { isMutating, trigger } = useSWRPut(`/contacts/${data.id}`);
  const { mutate } = useSWRConfig();
  return (
    <Tooltip content="Estado" placement="top" arrow animation="fade">
      <button
        className="action-btn"
        type="button"
        disabled={isMutating}
        onClick={async () => {
          await trigger({ ...data, status: !data.status });
          await mutation();
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

const CrudModal = ({ OpenButtonComponent, title, data = {}, mutation }) => {
  const { operatorId } = useAuth();

  const [open, isOpen] = useState(false);
  const schema = yup
    .object({
      name: yup.string().required("Nombre requerido"),
      email: yup.string().email().required("Correo requerido"),
    })
    .required();

  const { trigger } = data.id
    ? useSWRPut(`/contacts/${data.id}`)
    : useSWRPost(`/contacts`);

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <>
      <OpenButtonComponent
        onClick={() => {
          reset(data);
          isOpen(true);
        }}
      />
      <Modal
        activeModal={open}
        onClose={() => isOpen(false)}
        title={title}
        labelClass="btn-outline-dark"
        uncontrol={false}
        className="max-w-3xl"
        footerContent={
          <Button
            text="Guardar"
            form="role-form"
            type="submit"
            className="btn-outline btn-dark"
            isLoading={isSubmitting}
          />
        }
      >
        <form
          noValidate
          id="role-form"
          className="space-y-4"
          onSubmit={handleSubmit(async (form) => {
            await trigger({ ...form, operatorId });
            await mutation();
            isOpen(false);
          })}
        >
          <Textinput
            label="Nombre"
            name="name"
            type="text"
            placeholder="Nombre"
            register={register}
            error={errors?.name}
          />
          <Textinput
            label="Correo"
            name="email"
            type="text"
            placeholder="Correo"
            register={register}
            error={errors?.email}
          />
        </form>
      </Modal>
    </>
  );
};

export const Contact = () => {
  const { operatorId, hasRoleAccess } = useAuth();

  const {
    data: response,
    isLoading,
    isValidating,
    mutate,
  } = useSWRGet(`/contacts/operator/${operatorId}`);

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

              {hasRoleAccess("contacts", "edit") && (
                <>
                  {" "}
                  <CrudModal
                    title="Editar"
                    data={row.original}
                    mutation={mutate}
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
                  <StatusModal data={row.original} mutation={mutate} />
                </>
              )}

              {hasRoleAccess("contacts", "delete") && (
                <DeleteModal
                  url={`/contacts/${row.original.id}`}
                  mutation={mutate}
                />
              )}
            </div>
          );
        },
      },
      {
        Header: "Nombre",
        accessor: "name",
      },
      {
        Header: "Correo",
        accessor: "email",
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ row }) => <CellBoolStatus status={row.original.status} />,
      },
    ],
    []
  );

  const actionMenu = useMemo(
    () => (
      <div className="flex flex-row gap-3">
        {hasRoleAccess("contacts", "edit") && (
          <CrudModal
            title={"Crear"}
            OpenButtonComponent={NewButton}
            mutation={mutate}
          />
        )}
      </div>
    ),
    []
  );

  if (isLoading && response == null) {
    return <SkeletionTable count={10} />;
  }

  return (
    <BaseTable
      title={"Contactos"}
      columns={columns}
      data={response?.data}
      isValidating={isValidating}
      ActionComponent={actionMenu}
    />
  );
};

export default Contact;
