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
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import useSWRPost from "@/hooks/useSWRPost";
import { useSWRConfig } from "swr";
import SkeletionTable from "@/components/skeleton/Table";
import useAuth from "@/hooks/useAuth";
import useSWRDelete from "@/hooks/useSWRDelete";
import useSWRPut from "@/hooks/useSWRPut";
import {
  CONTAINER_STATUS,
  toFormatContainer,
  toFormatDateTime,
} from "@/helpers/helper";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Card from "../Card";
import { DeleteModal } from "@/components/partials/modal/Modals";
import Cleave from "cleave.js/react";
import EndpointSelect from "../Selects/EndpointSelect";
import CellStatus from "../CellStatus";
import SizeSelect from "../Selects/SizeSelect";

const StatusModal = ({ data, mutation }) => {
  const { isMutating, trigger } = useSWRPut(`/containers/${data.id}`);
  return (
    <Tooltip content="Anular" placement="top" arrow animation="fade">
      <button
        className="action-btn"
        type="button"
        disabled={isMutating}
        onClick={async () => {
          await trigger({
            ...data,
            status: CONTAINER_STATUS.ANULADO,
            voidDate: new Date(),
          });
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
  const { osId } = useParams();

  const [open, isOpen] = useState(false);
  const schema = yup
    .object({
      name: yup.string().required("Contenedor requerido").validContainer(),
      endpoint: yup.string().required("Destino requerido"),
      size: yup.string().required("Tamaño requerido"),
    })
    .required();

  const { trigger } = data.id
    ? useSWRPut(`/containers/${data.id}`)
    : useSWRPost(`/containers`);

  const {
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
            await trigger({ ...form, serviceOrderId: osId });
            await mutation();
            isOpen(false);
          })}
        >
          <div>
            <label className={`form-label block capitalize mb-2`}>
              Contenedor
            </label>
            <Controller
              control={control}
              name={"name"}
              render={({ field: { value, onChange } }) => {
                return (
                  <>
                    <Cleave
                      placeholder="Contenedor"
                      value={value}
                      onChange={(e) => onChange(e.target.rawValue)}
                      options={{
                        delimiters: ["", "-"],
                        blocks: [4, 6, 1],
                        uppercase: true,
                      }}
                      className={`form-control py-2 ${
                        errors?.name
                          ? " border-danger-500 focus:ring-danger-500  focus:ring-opacity-90 focus:ring-1"
                          : ""
                      } `}
                    />
                    {errors?.name && (
                      <div className={` mt-2 text-danger-500 block text-sm`}>
                        {errors?.name.message}
                      </div>
                    )}
                  </>
                );
              }}
            />

            <Controller
              control={control}
              name="size"
              render={({ field: { value, onChange } }) => (
                <SizeSelect
                  onChange={onChange}
                  error={errors?.size}
                  defaultValue={value}
                />
              )}
            />

            <Controller
              control={control}
              name="endpoint"
              render={({ field: { value, onChange } }) => (
                <EndpointSelect
                  isDisabled={
                    data.status != null &&
                    data.status != CONTAINER_STATUS.PENDIENTE
                  }
                  onChange={onChange}
                  error={errors?.endpoint}
                  defaultValue={value}
                />
              )}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

const Container = () => {
  const { osId } = useParams();
  const { hasRoleAccess } = useAuth();
  const {
    data: response,
    isLoading,
    isValidating,
    mutate,
  } = useSWRGet(`/os/${osId}`);

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
              {row.original.status != CONTAINER_STATUS.ANULADO &&
                hasRoleAccess("os", "edit") && (
                  <>
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
              {hasRoleAccess("os", "delete") && (
                <DeleteModal
                  url={`/containers/${row.original.id}`}
                  mutation={mutate}
                />
              )}
            </div>
          );
        },
      },
      {
        Header: "Contenedor",
        accessor: "name",
        Cell: ({ row }) => toFormatContainer(row.original.name),
      },
      {
        Header: "Tamaño",
        accessor: "size",
      },
      {
        Header: "Destino",
        accessor: "containerEndpoints",
        Cell: ({ row }) => (
          <ol className="list-none">
            {row.original.containerEndpoints
              .sort((x, y) => x.order - y.order)
              .map((x, i) => {
                let color = "text-slate-500";
                if (x.status) color = `text-success-500`;
                else if (x.error) color = `text-danger-500`;
                return (
                  <li key={i}>
                    <div className="flex flex-row gap-2 items-center">
                      <div>
                        <Icon
                          height="20"
                          className={color}
                          icon={
                            x.status
                              ? `heroicons-outline:check-circle`
                              : `heroicons-outline:no-symbol`
                          }
                        />
                      </div>
                      <span className="font-bold">{x.rpa.name}</span>
                    </div>
                  </li>
                );
              })}
          </ol>
        ),
      },
      ,
      {
        Header: "Creación",
        accessor: "createdAt",
        Cell: ({ row }) => toFormatDateTime(row.original.createdAt),
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ row }) => {
          let status = row.original.status;

          const isAnyError = row.original.containerEndpoints.some(
            (x) => x.error
          );

          if (isAnyError) {
            status = CONTAINER_STATUS.ERROR;
          }

          return <CellStatus text={status} />;
        },
      },
    ],
    []
  );

  const actionMenu = useMemo(
    () => (
      <div>
        {hasRoleAccess("os", "edit") && (
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

  if (isLoading) {
    return <SkeletionTable count={10} />;
  }

  return (
    <Card>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm">
        <div className="flex justify-between ">
          <label className="form-label block capitalize font-semibold">
            OS
          </label>
          <span className="flex justify-end w-full">{response?.data.code}</span>
        </div>
        <div className="flex justify-between">
          <label className="form-label block capitalize font-semibold">
            Creación
          </label>
          <span className="flex justify-end w-full">
            {toFormatDateTime(response?.data.createdAt)}
          </span>
        </div>
      </div>

      <hr />
      <BaseTable
        bodyClass={"mt-3"}
        noClass={true}
        title="Contenedores"
        columns={columns}
        data={response?.data?.containers}
        ActionComponent={actionMenu}
        isValidating={isValidating}
      />
    </Card>
  );
};

export default Container;
