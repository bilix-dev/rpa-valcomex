"use client";

import BaseTable, {
  IndeterminateCheckbox,
} from "@/components/partials/table/BaseTable";

import useSWRGet from "@/hooks/useSWRGet";
import React, { useMemo, useState } from "react";
import SkeletionTable from "@/components/skeleton/Table";
import useAuth from "@/hooks/useAuth";
import { CONTAINER_STATUS, toFormatContainer } from "@/helpers/helper";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { useWs } from "@/context/WsProvider";
import { Icon } from "@iconify/react";
import Button from "../Button";
import Tooltip from "../Tooltip";
import useSWRPut from "@/hooks/useSWRPut";
import CellStatus from "../CellStatus";
import CellMatch from "../CellMatch";
import StatusBar from "../StatusBar";
import { FilterBadge } from "@/components/partials/table/FilterBadge";
import ImageModal from "../ImageModal";
import DetailsModal from "../DetailsModal";

const PendingTable = ({ data, mutation, isValidating }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleRows, setToggleRows] = useState(false);
  const { hasRoleAccess } = useAuth();
  // const filteredSelectedRows = useMemo(
  //   () => selectedRows.filter((x) => x.status != CONTAINER_STATUS.PENDIENTE),
  //   [selectedRows]
  // );

  const [filter, setFilter] = useState([
    { data: CONTAINER_STATUS.PENDIENTE, status: true, color: "bg-warning-500" },
    { data: CONTAINER_STATUS.MATCH, status: true, color: "bg-violet-500" },
  ]);

  const { trigger, isMutating } = useSWRPut("/matching");

  const tableData = useMemo(
    () =>
      data
        ?.filter(
          (x) =>
            x.status == CONTAINER_STATUS.PENDIENTE ||
            x.status == CONTAINER_STATUS.MATCH
        )
        .filter((x) => filter?.find((y) => y.data == x.status)?.status) ?? [],
    [data, filter]
  );

  const columns = useMemo(
    () => [
      {
        id: "selection",
        accessor: "selection",
        disableSortBy: true,
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }) => (
          <div>
            {row.original.status != CONTAINER_STATUS.PENDIENTE && (
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            )}
          </div>
        ),
      },
      {
        Header: "Opciones",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
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
            </div>
          );
        },
      },
      {
        Header: "OS",
        accessor: "serviceOrder.code",
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
              .map((x, i) => (
                <li key={i}>
                  <div className="flex flex-row gap-2 items-center">
                    <div>
                      <Icon
                        height="20"
                        className={
                          x.status ? `text-success-500` : `text-slate-500`
                        }
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
              ))}
          </ol>
        ),
      },
      {
        Header: "Chofer",
        accessor: "containerMatch",
        Cell: ({ row }) => <CellMatch match={row.original.containerMatch} />,
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ row }) => <CellStatus text={row.original.status} />,
      },
      {
        Header: "Flujo",
        Cell: ({ row }) => <StatusBar data={row.original} />,
      },
    ],

    []
  );

  const actionMenu = useMemo(
    () => (
      <div>
        {selectedRows.filter((x) => x.status != CONTAINER_STATUS.PENDIENTE)
          .length > 0 &&
          hasRoleAccess("matching", "edit") && (
            <Tooltip
              content={"Procesar"}
              placement="top"
              arrow
              animation="fade"
            >
              <div>
                <Button
                  isLoading={isMutating}
                  icon={"heroicons-outline:chevron-double-right"}
                  className={"btn-primary btn-sm rounded-[999px]"}
                  onClick={async () => {
                    await trigger({
                      ids: selectedRows
                        .filter((x) => x.status != CONTAINER_STATUS.PENDIENTE)
                        .map((x) => x.id),
                    });
                    await mutation();
                    setToggleRows(!toggleRows);
                    setSelectedRows([]);
                  }}
                />
              </div>
            </Tooltip>
          )}
      </div>
    ),
    [selectedRows, isMutating]
  );

  return (
    <BaseTable
      title={
        <div className="grid grid-col-1 gap-2 me-2">
          <div>En Espera</div>
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
      data={tableData}
      ActionComponent={actionMenu}
      // isValidating={isValidating}
      setSelectedRows={setSelectedRows}
      initialState={{
        hiddenColumns: [!hasRoleAccess("matching", "edit") ? "selection" : ""],
        pageSize: 5,
      }}
      toggleRows={toggleRows}
    />
  );
};

const StatusModal = ({ data, mutation }) => {
  const { isMutating, trigger } = useSWRPut(`/matching/container/${data.id}`);

  const cachedList = (cache) =>
    cache.data.map((x) => ({
      ...x,
      containerEndpoints:
        x.id != data.id
          ? x.containerEndpoints
          : x.containerEndpoints.map((y) => ({
              ...y,
              error: y.status ? y.error : false,
            })),
    }));

  return (
    <Tooltip content="Tramitar" placement="top" arrow animation="fade">
      <button
        className="action-btn btn-success"
        type="button"
        disabled={isMutating}
        onClick={async () => {
          await mutation(
            async (cache) => {
              await trigger();
              const cl = cachedList(cache);
              return {
                ...cache,
                data: [...cl],
              };
            },
            {
              optimisticData: (cache) => {
                const cl = cachedList(cache);
                return {
                  ...cache,
                  data: [...cl],
                };
              },

              rollbackOnError: true,
              revalidate: false,
            }
          );
        }}
      >
        <LoadingIcon icon="heroicons:check" isLoading={isMutating} />
      </button>
    </Tooltip>
  );
};

const ProcessTable = ({ data, mutation, info }) => {
  const [status, setStatus] = useState({ open: false, screenshot: null });
  const [filter, setFilter] = useState([
    { data: CONTAINER_STATUS.ESPERA, status: true, color: "bg-slate-500" },
    { data: CONTAINER_STATUS.VISADO, status: true, color: "bg-primary-500" },
  ]);

  const { hasRoleAccess } = useAuth();

  const tableData = useMemo(
    () =>
      data
        ?.filter(
          (x) =>
            x.status == CONTAINER_STATUS.ESPERA ||
            x.status == CONTAINER_STATUS.VISADO ||
            x.status == CONTAINER_STATUS.PROCESANDO
        )
        .filter((x) => filter?.find((y) => y.data == x.status)?.status) ?? [],
    [data, filter]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Opciones",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => {
          const isAnyLoading = row.original.containerEndpoints.some((x) =>
            info[x.rpa.code]?.waitingIds.includes(x.id)
          );

          if (isAnyLoading)
            return (
              <LoadingIcon
                height="24"
                isLoading={isAnyLoading}
                className={`text-primary-500`}
                icon={`heroicons-outline:check-circle`}
              />
            );

          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
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
              {row.original.status == CONTAINER_STATUS.ESPERA &&
                hasRoleAccess("matching", "edit") && (
                  <StatusModal data={row.original} mutation={mutation} />
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
                const isCurrent = info[x.rpa.code]?.currentId == x.id;
                const isLoading = info[x.rpa.code]?.waitingIds.includes(x.id);
                let color = "text-slate-500";
                if (x.status) color = `text-success-500`;
                else if (isCurrent) color = `text-primary-500`;
                else if (isLoading) color = `text-slate-500`;
                else if (x.error) color = `text-danger-500`;

                return (
                  <li key={i}>
                    <div className="flex flex-row gap-2 items-center">
                      <LoadingIcon
                        height="20"
                        isLoading={isLoading}
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
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ row }) => {
          let status = row.original.status;

          if (row.original.status == CONTAINER_STATUS.ESPERA) {
            const isAnyLoading = row.original.containerEndpoints.some((x) =>
              info[x.rpa.code]?.waitingIds.includes(x.id)
            );
            const isAnyError = row.original.containerEndpoints.some(
              (x) => x.error
            );
            if (isAnyError && status != CONTAINER_STATUS.ANULADO) {
              status = CONTAINER_STATUS.ERROR;
            } else if (isAnyLoading) {
              status = CONTAINER_STATUS.PROCESANDO;
            }
          }
          return <CellStatus text={status} />;
        },
      },
      {
        Header: "Flujo",
        Cell: ({ row }) => <StatusBar data={row.original} />,
      },
    ],
    [info]
  );

  return (
    <>
      <ImageModal title={"Ver"} status={status} setStatus={setStatus} />
      <BaseTable
        title={
          <div className="grid grid-col-1 gap-2 me-2">
            <div>En Proceso</div>
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
        data={tableData}
        // isValidating={isValidating}
        initialState={{
          pageSize: 5,
        }}
      />
    </>
  );
};

const Matching = () => {
  const { operatorId } = useAuth();
  const ws = useWs();

  const {
    data: response,
    isLoading,
    isValidating,
    mutate,
  } = useSWRGet(`/matching/operator/${operatorId}`, { refreshInterval: 250 });

  if (ws.status != "connected") {
    return (
      <div className="flex flex-row items-center gap-5">
        <LoadingIcon height="32" isLoading={true} />
        <div className="font-bold">Conectando...</div>
      </div>
    );
  }

  if (isLoading) {
    return <SkeletionTable count={10} />;
  }

  return (
    <div className="grid 2xl:grid-cols-2 grid-cols-1 2xl:gap-x-5 gap-y-5">
      <PendingTable
        data={response?.data}
        isValidating={isValidating}
        mutation={mutate}
      />
      <ProcessTable
        info={ws.info}
        data={response?.data}
        isValidating={isValidating}
        mutation={mutate}
      />
    </div>
  );
};

export default Matching;
