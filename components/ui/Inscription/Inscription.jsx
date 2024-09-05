"use client";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useMemo, useRef, useState } from "react";
import PendingContainerSelect from "../Selects/PendingContainerSelect";
import useSWRGet from "@/hooks/useSWRGet";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "../Textinput";
import Button from "../Button";
import useSWRPost from "@/hooks/useSWRPost";
import { useSWRConfig } from "swr";
import BaseTable, { RegistryInfo } from "@/components/partials/table/BaseTable";
import {
  CONTAINER_STATUS,
  ENDPOINTS,
  ENDPOINTS_KEYS,
  toFormatContainer,
} from "@/helpers/helper";
import Card from "../Card";
import Tooltip from "../Tooltip";
import SkeletionTable from "@/components/skeleton/Table";
import { DeleteModal } from "@/components/partials/modal/Modals";
import useSWRPut from "@/hooks/useSWRPut";
import LoadingIcon from "../LoadingIcon";
import CellStatus from "../CellStatus";
import { Icon } from "@iconify/react";
import StatusBar from "../StatusBar";
import { FilterBadge } from "@/components/partials/table/FilterBadge";
import ImageModal from "../ImageModal";
import CountrySelect from "../Selects/CountrySelect";
import { useSystemData } from "@/context/AuthProvider";
import DetailsModal from "../DetailsModal";

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

const InscriptionTable = ({ data, mutation, isValidating }) => {
  const { operatorId, hasRoleAccess } = useAuth();

  const { mutate: mutateSelect } = useSWRConfig();
  const [status, setStatus] = useState({ open: false, screenshot: null });

  const [filter, setFilter] = useState([
    { data: CONTAINER_STATUS.MATCH, status: true, color: "bg-violet-500" },
    { data: CONTAINER_STATUS.ESPERA, status: true, color: "bg-slate-500" },
    { data: CONTAINER_STATUS.TRAMITADO, status: true, color: "bg-primary-500" },
    {
      data: CONTAINER_STATUS.FINALIZADO,
      status: false,
      color: "bg-success-500",
    },
    { data: CONTAINER_STATUS.ANULADO, status: false, color: "bg-danger-500" },
  ]);

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
              <DetailsModal
                title="Detalle"
                data={row.original}
                OpenButtonComponent={({ onClick }) => (
                  <Tooltip content="Ver" placement="top" arrow animation="fade">
                    <button
                      className="action-btn"
                      type="submit"
                      onClick={onClick}
                    >
                      <Icon icon="heroicons:eye" />
                    </button>
                  </Tooltip>
                )}
              />
              {row.original.status == CONTAINER_STATUS.TRAMITADO &&
                hasRoleAccess("inscription", "edit") && (
                  <StatusModal data={row.original} mutation={mutation} />
                )}

              {row.original.status == CONTAINER_STATUS.MATCH &&
                hasRoleAccess("inscription", "delete") && (
                  <DeleteModal
                    url={`/inscriptions/container/${row.original.id}`}
                    mutation={async () => {
                      await mutation();
                      await mutateSelect([
                        `containers/select/operator/${operatorId}`,
                      ]);
                    }}
                  />
                )}
            </div>
          );
        },
      },
      {
        Header: "OS",
        accessor: "serviceOrder.code",
      },
      {
        Header: "Booking",
        accessor: "serviceOrder.booking",
      },
      {
        Header: "Contenedor",
        accessor: "name",
        Cell: ({ row }) => toFormatContainer(row.original.name),
      },
      {
        Header: "Patente",
        accessor: "containerMatch.plateNumber",
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
      {
        Header: "Flujo",
        Cell: ({ row }) => <StatusBar data={row.original} />,
      },
    ],
    []
  );

  return (
    <>
      <ImageModal title={"Ver"} status={status} setStatus={setStatus} />
      <BaseTable
        title={
          <div className="grid grid-col-1 gap-2 me-2">
            <div>Inscripciones</div>
            <div className="grid grid-cols-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
              {filter.map((x, i) => (
                <FilterBadge
                  key={i}
                  title={x.data}
                  filter={filter}
                  setFilter={setFilter}
                  colorClass={x.color}
                  count={data.filter((y) => y.status == x.data).length}
                />
              ))}
            </div>
          </div>
        }
        columns={columns}
        data={data.filter(
          (x) => filter?.find((y) => y.data == x.status)?.status
        )}
        isValidating={isValidating}
        initialState={{
          pageSize: 5,
        }}
      />
    </>
  );
};

const schema1 = yup
  .object({
    containerId: yup.string().required("Contenedor requerido"),
    plateNumber: yup.string().required("Patente requerida"),
    micdta: yup.string().required("MIC/DTA requerido"),
    seal: yup.string().required("Sello requerido"),
  })
  .required();

const schema2 = yup
  .object({
    containerId: yup.string().required("Contenedor requerido"),
    plateNumber: yup.string().required("Patente requerida"),
    micdta: yup.string().required("MIC/DTA requerido"),
    seal: yup.string().required("Sello requerido"),
    sealLine: yup.string().required("Sello linea requerido"),
    plateNumberCountry: yup.string().required("País requerido"),
  })
  .required();

const Inscription = () => {
  const { userId, operatorId, hasRoleAccess } = useAuth();
  const [schema, setSchema] = useState(null);
  const { user } = useSystemData();
  const [values, setValues] = useState([]);
  const ref = useRef(null);

  const { mutate: mutateSelect } = useSWRConfig();

  const {
    data: response,
    isLoading,
    isValidating,
    mutate,
  } = useSWRGet(`/inscriptions/user/${userId}`);

  const { trigger } = useSWRPost(`/inscriptions`);

  const {
    register,
    reset,
    clearErrors,
    watch,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedContainer = useMemo(
    () => values.find((x) => x.id == watch("containerId")),
    [watch("containerId")]
  );

  useEffect(() => {
    if (!watch("containerId")) reset();
  }, [watch("containerId")]);

  useEffect(() => {
    if (selectedContainer != null) {
      switch (selectedContainer.endpoint) {
        case ENDPOINTS_KEYS.pc:
        case ENDPOINTS_KEYS.sti:
          setSchema(schema1);
          break;
        case ENDPOINTS_KEYS.silogport_tps:
          setSchema(schema2);
          break;
      }
    }
  }, [selectedContainer]);

  return (
    <div className="grid 2xl:grid-cols-3 grid-cols-1 2xl:gap-x-5 gap-y-5">
      <form
        noValidate
        id="user-form"
        className="space-y-4"
        onSubmit={handleSubmit(async (form) => {
          const response = await trigger({
            ...form,
            userId,
          });
          //Limpieza de tabla
          if (response?.data?.status == 0) {
            await mutate();
            await mutateSelect([`containers/select/operator/${operatorId}`]);
            ref?.current.clearValue();
            clearErrors();
          }
        })}
      >
        <Card
          title={"Inscribir"}
          headerslot={
            selectedContainer && (
              <Tooltip
                content={"Inscribir"}
                placement="top"
                arrow
                animation="fade"
              >
                <div>
                  <Button
                    type="submit"
                    form="user-form"
                    icon={"heroicons-outline:chevron-double-right"}
                    className="btn btn inline-flex justify-center btn-primary btn-sm rounded-[999px]"
                    isLoading={isSubmitting}
                  />
                </div>
              </Tooltip>
            )
          }
        >
          <div className="space-y-4">
            <Controller
              control={control}
              name="containerId"
              render={({ field: { onChange, value } }) => (
                <PendingContainerSelect
                  ref={ref}
                  setValues={setValues}
                  operatorId={operatorId}
                  defaultValue={value}
                  onChange={onChange}
                  isDisabled={!hasRoleAccess("inscription", "edit")}
                  isClearable
                  error={errors.containerId}
                />
              )}
            />
            {selectedContainer && (
              <>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="capitalize font-semibold">OS</div>
                    <span>{selectedContainer.serviceOrder.code}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="capitalize font-semibold">Booking</div>
                    <span>{selectedContainer.serviceOrder.booking}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 mb-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="capitalize font-semibold">Destino</div>
                    <span>{ENDPOINTS[selectedContainer.endpoint]}</span>
                  </div>
                </div>
                <hr />

                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="capitalize font-semibold">Chofer</div>
                    <span>{user.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="capitalize font-semibold">DNI / RUT</div>
                    <span>{user.dni}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="capitalize font-semibold">País Chofer</div>
                    <span>{user.country}</span>
                  </div>
                </div>
                <hr />
                <Textinput
                  name="plateNumber"
                  label="Patente"
                  placeholder="Patente"
                  type="text"
                  register={register}
                  error={errors?.plateNumber}
                />

                {(ENDPOINTS_KEYS.sti == selectedContainer.endpoint ||
                  ENDPOINTS_KEYS.pc == selectedContainer.endpoint) && (
                  <>
                    <Textinput
                      name="micdta"
                      label="MIC/DTA de USPALLATA"
                      placeholder="MIC/DTA de USPALLATA"
                      type="text"
                      register={register}
                      error={errors?.micdta}
                    />
                    <Textinput
                      name="seal"
                      label="Sello Aduana Argentina"
                      placeholder="Sello Aduana Argentina"
                      type="text"
                      register={register}
                      error={errors?.seal}
                    />
                  </>
                )}

                {ENDPOINTS_KEYS.silogport_tps == selectedContainer.endpoint && (
                  <>
                    <Controller
                      control={control}
                      name="plateNumberCountry"
                      render={({ field: { onChange } }) => (
                        <div>
                          <CountrySelect
                            label={"País Patente"}
                            onChange={onChange}
                          />
                          {errors.plateNumberCountry && (
                            <div
                              className={`mt-2 text-danger-500 block text-sm`}
                            >
                              {errors.plateNumberCountry.message}
                            </div>
                          )}
                        </div>
                      )}
                    />
                    <Textinput
                      name="micdta"
                      label="MIC/DTA Electrónico"
                      placeholder="MIC/DTA Electrónico"
                      type="text"
                      register={register}
                      error={errors?.micdta}
                    />
                    <Textinput
                      name="seal"
                      label="Sello Aduana Argentina"
                      placeholder="Sello Aduana Argentina"
                      type="text"
                      register={register}
                      error={errors?.seal}
                    />
                    <Textinput
                      name="sealLine"
                      label="Sello Línea"
                      placeholder="Sello Linea"
                      type="text"
                      register={register}
                      error={errors?.sealLine}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </Card>
      </form>
      <div className="col-span-2">
        {!isLoading ? (
          <InscriptionTable
            data={response?.data}
            isValidating={isValidating}
            mutation={mutate}
          />
        ) : (
          <SkeletionTable count={10} />
        )}
      </div>
    </div>
  );
};

export default Inscription;
