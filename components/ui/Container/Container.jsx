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
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import useSWRPost from "@/hooks/useSWRPost";
import SkeletionTable from "@/components/skeleton/Table";
import useAuth from "@/hooks/useAuth";
import useSWRPut from "@/hooks/useSWRPut";
import {
  CONTAINER_STATUS,
  ENDPOINTS_KEYS,
  toFormatContainer,
  toFormatDateTime,
} from "@/helpers/helper";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { useParams } from "next/navigation";
import Card from "../Card";
import { DeleteModal } from "@/components/partials/modal/Modals";
import Cleave from "cleave.js/react";
import EndpointSelect from "../Selects/EndpointSelect";
import CellStatus from "../CellStatus";
import CellMatch from "../CellMatch";
import ImageModal from "../ImageModal";
import ContainerTypeSelect from "../Selects/ContainerTypeSelect";

const VoidModal = ({ data, mutation }) => {
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

const StatusModal = ({ data, mutation }) => {
  const { isMutating, trigger } = useSWRPut(`/containers/${data.id}`);
  return (
    <Tooltip content="Finalizar" placement="top" arrow animation="fade">
      <button
        className="action-btn btn-success"
        type="button"
        disabled={isMutating}
        onClick={async () => {
          await trigger({
            ...data,
            status: CONTAINER_STATUS.FINALIZADO,
            endDate: new Date(),
          });
          await mutation();
        }}
      >
        <LoadingIcon icon="heroicons:check" isLoading={isMutating} />
      </button>
    </Tooltip>
  );
};

const CrudModal = ({ OpenButtonComponent, title, data = {}, mutation }) => {
  const { osId } = useParams();

  const [open, isOpen] = useState(false);
  const [schema, setSchema] = useState(yup.object({}));

  const { trigger } = data.id
    ? useSWRPut(`/containers/${data.id}`)
    : useSWRPost(`/containers`);

  const {
    reset,
    control,
    watch,
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    switch (watch("endpoint")) {
      case ENDPOINTS_KEYS.pc:
        setSchema(
          yup
            .object({
              name: yup
                .string()
                .required("Contenedor requerido")
                .validContainer(),
              endpoint: yup.string().required("Destino requerido"),
              weight: yup
                .number()
                .typeError("Peso requerido")
                .required("Peso requerido"),
              clientRut: yup.string().required("Rut cliente requerido"),
              dispatcher: yup.string().required("Transportista requerido"),
            })
            .required()
        );
        break;
      case ENDPOINTS_KEYS.sti:
        setSchema(
          yup
            .object({
              name: yup
                .string()
                .required("Contenedor requerido")
                .validContainer(),
              endpoint: yup.string().required("Destino requerido"),
              weight: yup
                .number()
                .typeError("Peso neto requerido")
                .required("Peso neto requerido"),
              vgmWeight: yup
                .number()
                .typeError("Peso VGM requerido")
                .required("Peso VGM requerido"),
              operation: yup.string().required("Código de operación requerido"),
              clientRut: yup.string().required("Rut cliente requerido"),
              shippingCompany: yup.string().required("Razón social requerida"),
              businessName: yup.string().required("Código naviera requerido"),
            })
            .required()
        );
        break;
      case ENDPOINTS_KEYS.silogport_tps:
        setSchema(
          yup
            .object({
              name: yup
                .string()
                .required("Contenedor requerido")
                .validContainer(),
              endpoint: yup.string().required("Destino requerido"),
              ship: yup.string().required("Nave requerida"),
              custom: yup.string().required("Aduana requerida"),
              containerType: yup.string().required("Tipo contenedor requerido"),
            })
            .required()
        );
        break;
    }
  }, [watch("endpoint")]);

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
          <div className="grid grid-cols-1 gap-2">
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
            {/* 
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
            /> */}

            <Controller
              control={control}
              name="endpoint"
              render={({ field: { value, onChange } }) => (
                <EndpointSelect
                  isDisabled={
                    data.status != null &&
                    data.status != CONTAINER_STATUS.PENDIENTE
                  }
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  onChange={onChange}
                  error={errors?.endpoint}
                  defaultValue={value}
                />
              )}
            />
            <div className="my-2">
              <hr />
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
              {/*Silogport_TPS*/}
              {watch("endpoint") == ENDPOINTS_KEYS.silogport_tps && (
                <>
                  <Controller
                    control={control}
                    name="containerType"
                    render={({ field: { value, onChange } }) => (
                      <div>
                        <ContainerTypeSelect
                          defaultValue={value}
                          onChange={onChange}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                        {errors.containerType && (
                          <div className={`mt-2 text-danger-500 block text-sm`}>
                            {errors.containerType.message}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <Textinput
                    name="ship"
                    label="Nave"
                    placeholder="Nave"
                    type="text"
                    register={register}
                    error={errors?.ship}
                  />

                  <Textinput
                    name="custom"
                    label="Aduana"
                    placeholder="Aduana"
                    type="text"
                    register={register}
                    error={errors?.custom}
                  />
                </>
              )}

              {/*STI*/}
              {watch("endpoint") == ENDPOINTS_KEYS.sti && (
                <>
                  <Textinput
                    name="operation"
                    label="Operación"
                    placeholder="Operación"
                    type="text"
                    register={register}
                    error={errors?.operation}
                  />
                  <Textinput
                    name="shippingCompany"
                    label="Código Naviera"
                    placeholder="Código Naviera"
                    type="text"
                    register={register}
                    error={errors?.shippingCompany}
                  />
                  <Textinput
                    name="weight"
                    label="Peso Neto"
                    placeholder="Peso Neto"
                    type="number"
                    register={register}
                    error={errors?.weight}
                  />
                  <Textinput
                    name="vgmWeight"
                    label="Peso VGM"
                    placeholder="Peso VGM"
                    type="number"
                    register={register}
                    error={errors?.vgmWeight}
                  />

                  <Textinput
                    name="businessName"
                    label="Razón Social"
                    placeholder="Razón Social"
                    type="text"
                    register={register}
                    error={errors?.businessName}
                  />

                  <div className="fromGroup">
                    <label className={`form-label block capitalize mb-2`}>
                      Rut Cliente
                    </label>
                    <Controller
                      control={control}
                      name={"clientRut"}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <>
                            <Cleave
                              placeholder="Rut Cliente"
                              value={value}
                              onChange={(e) => onChange(e.target.rawValue)}
                              options={{
                                delimiters: [".", ".", "-"],
                                blocks: [2, 3, 3, 1],
                                uppercase: true,
                              }}
                              className={`form-control py-2 ${
                                errors?.clientRut
                                  ? " border-danger-500 focus:ring-danger-500  focus:ring-opacity-90 focus:ring-1"
                                  : ""
                              } `}
                            />
                            {errors?.clientRut && (
                              <div
                                className={` mt-2 text-danger-500 block text-sm`}
                              >
                                {errors?.clientRut.message}
                              </div>
                            )}
                          </>
                        );
                      }}
                    />
                  </div>
                </>
              )}

              {/* PC */}
              {watch("endpoint") == ENDPOINTS_KEYS.pc && (
                <>
                  <Textinput
                    name="weight"
                    label="Peso"
                    placeholder="Peso"
                    type="number"
                    register={register}
                    error={errors?.weight}
                  />
                  <div className="fromGroup">
                    <label className={`form-label block capitalize mb-2`}>
                      Rut Cliente
                    </label>
                    <Controller
                      control={control}
                      name={"clientRut"}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <>
                            <Cleave
                              placeholder="Rut Cliente"
                              value={value}
                              onChange={(e) => onChange(e.target.rawValue)}
                              options={{
                                delimiters: [".", ".", "-"],
                                blocks: [2, 3, 3, 1],
                                uppercase: true,
                              }}
                              className={`form-control py-2 ${
                                errors?.clientRut
                                  ? " border-danger-500 focus:ring-danger-500  focus:ring-opacity-90 focus:ring-1"
                                  : ""
                              } `}
                            />
                            {errors?.clientRut && (
                              <div
                                className={` mt-2 text-danger-500 block text-sm`}
                              >
                                {errors?.clientRut.message}
                              </div>
                            )}
                          </>
                        );
                      }}
                    />
                  </div>
                  <Textinput
                    name="dispatcher"
                    label="Transportista"
                    placeholder="Transportista"
                    type="text"
                    register={register}
                    error={errors?.dispatcher}
                  />
                </>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

const Container = () => {
  const [status, setStatus] = useState({ open: false, screenshot: null });
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
                    {row.original.status != CONTAINER_STATUS.FINALIZADO &&
                      row.original.status != CONTAINER_STATUS.TRAMITADO && (
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

                    {row.original.status == CONTAINER_STATUS.TRAMITADO && (
                      <StatusModal data={row.original} mutation={mutate} />
                    )}

                    {row.original.status != CONTAINER_STATUS.FINALIZADO &&
                      row.original.status != CONTAINER_STATUS.TRAMITADO && (
                        <VoidModal data={row.original} mutation={mutate} />
                      )}
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
                          onClick={
                            x.status
                              ? () => {
                                  setStatus({
                                    open: true,
                                    screenshot: x.screenshot,
                                  });
                                }
                              : null
                          }
                          style={x.status && { cursor: "pointer" }}
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
      {
        Header: "Chofer",
        accessor: "containerMatch",
        Cell: ({ row }) => <CellMatch match={row.original.containerMatch} />,
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
        <div className="flex justify-between items-center">
          <div className="form-label block capitalize font-semibold">OS</div>
          <span>{response?.data.code}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="capitalize font-semibold">Booking</div>
          <span>{response?.data.booking}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="capitalize font-semibold">Creación</div>
          <span>{toFormatDateTime(response?.data.createdAt)}</span>
        </div>
      </div>

      <hr />
      <ImageModal title={"Ver"} status={status} setStatus={setStatus} />
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
