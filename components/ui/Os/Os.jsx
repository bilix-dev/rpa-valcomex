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
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../Button";
import { Icon } from "@iconify/react";
import { DeleteModal } from "@/components/partials/modal/Modals";
import useSWRPut from "@/hooks/useSWRPut";
import useSWRPost from "@/hooks/useSWRPost";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import Textinput from "../Textinput";

import CellOsStatus from "../CellOsStatus";

const CrudModal = ({ OpenButtonComponent, title, data = {}, mutation }) => {
  const { operatorId } = useAuth();

  const [open, isOpen] = useState(false);
  const schema = yup
    .object({
      code: yup.string().required("OS requerida"),
      booking: yup.string().required("Booking requerido"),
    })
    .required();

  const { trigger } = data.id ? useSWRPut(`/os/${data.id}`) : useSWRPost(`/os`);

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
            label="OS"
            name="code"
            type="text"
            placeholder="Nombre"
            register={register}
            error={errors?.code}
          />
          <Textinput
            label="Booking"
            name="booking"
            type="text"
            placeholder="Booking"
            register={register}
            error={errors?.booking}
          />
        </form>
      </Modal>
    </>
  );
};

export const Os = () => {
  const [params, setParams] = useState({
    pageIndex: 0,
    pageSize: 10,
    sortBy: [],
    filters: [],
  });

  const { operatorId, hasRoleAccess } = useAuth();

  const {
    data: response,
    isLoading,
    isValidating,
    mutate,
  } = useSWRGet(
    [
      `/os/operator/${operatorId}`,
      {
        ...params,
      },
    ],
    {
      keepPreviousData: true,
    }
  );

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
              {hasRoleAccess("os", "edit") && (
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
              )}
              {hasRoleAccess("os", "delete") && (
                <DeleteModal url={`/os/${row.original.id}`} mutation={mutate} />
              )}
            </div>
          );
        },
      },
      {
        Header: "OS",
        accessor: "code",
        Filter: Filter,
      },
      {
        Header: "Booking",
        accessor: "booking",
        Filter: Filter,
      },
      {
        Header: "Creación",
        accessor: "createdAt",
        Cell: ({ row }) => toFormatDateTime(row.original.createdAt),
        Filter: DateFilter,
      },
      {
        Header: "Estado",
        Cell: ({ row }) => {
          let status = OS_STATUS.VACIO;

          if (row.original.containers.length != 0) {
            const type = row.original.containers.every(
              (x) =>
                x.status == CONTAINER_STATUS.FINALIZADO ||
                x.status == CONTAINER_STATUS.ANULADO
            );

            if (type) status = OS_STATUS.CERRADA;
            else status = OS_STATUS.ABIERTA;
          }

          return <CellOsStatus text={status} />;
        },
      },
      {
        Header: "Contenedores",
        Cell: ({ row }) => (
          <Button
            text={row.original.containers.length}
            className="btn-sm btn-outline-dark"
            icon={"heroicons-outline:chevron-double-right"}
            iconPosition={"right"}
            link={`os/${row.original.id}/containers`}
          />
        ),
      },
    ],
    []
  );

  const actionMenu = useMemo(
    () => (
      <div className="flex flex-row gap-3">
        {hasRoleAccess("os", "edit") && (
          <CrudModal
            title={"Crear"}
            OpenButtonComponent={NewButton}
            mutation={mutate}
          />
        )}
      </div>
    ),
    [params]
  );

  if (isLoading && response == null) {
    return <SkeletionTable count={10} />;
  }

  return (
    <BaseTable
      title={"Órdenes de Servicio"}
      columns={columns}
      data={response?.data?.rows}
      totalRows={response?.data?.count}
      isValidating={isValidating}
      setServerParams={setParams}
      manualPagination={true}
      manualFilters={true}
      manualSortBy={true}
      ActionComponent={actionMenu}
    />
  );
};

export default Os;
