"use client";
/* eslint-disable react/display-name */
import React, { useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";
import Tooltip from "@/components/ui/Tooltip";
import Button from "@/components/ui/Button";
import ManualPagination from "./ManualPagination";
import { Icon } from "@iconify/react";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { toFormatDateTime } from "@/helpers/helper";

export const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

export const NewButton = ({
  onClick,
  buttonProps = {
    name: "Crear",
    icon: "heroicons-outline:plus",
    className: "btn-dark btn-sm  rounded-[999px]",
  },
  ...rest
}) => (
  <Tooltip content={buttonProps.name} placement="top" arrow animation="fade">
    <div>
      <Button
        icon={buttonProps.icon}
        className={buttonProps.className}
        onClick={onClick}
        {...rest}
      />
    </div>
  </Tooltip>
);

export const RegistryInfo = ({ data }) => (
  <Tooltip
    html={
      <div>
        <h1 className="text-base bg-slate-900 dark:bg-slate-600 dark:bg-opacity-70 text-white rounded-t px-[8px] mt-[-5px] mx-[-8px] ">
          Información
        </h1>
        <div className="grid mt-2">
          <div>
            <div className="flex flex-wrap space-xy-5">
              <label className="font-semibold">Creación:</label>
              <div>{data.createdBy}</div>
              <div>{data.createdAt && toFormatDateTime(data.createdAt)}</div>
            </div>
          </div>
          <div className="flex flex-wrap space-xy-5">
            <label className="font-semibold">Modificación:</label>
            <div>{data.updatedBy}</div>
            <div>{data.createdAt && toFormatDateTime(data.updatedAt)}</div>
          </div>
        </div>
      </div>
    }
    placement="top"
    arrow
    animation="fade"
  >
    <Icon icon="heroicons:question-mark-circle" height="24" />
  </Tooltip>
);

const filterTypes = {
  dateBetween: (rows, id, filterValue) => {
    return rows.filter((row) => {
      const value = new Date(new Date(row.values[id]).setHours(0, 0, 0, 0));
      return value >= filterValue[0] && value <= filterValue[1];
    });
  },
};

const BaseTable = ({
  title = "",
  columns,
  data,
  ActionComponent,
  meta,
  manualPagination = false,
  manualFilters = false,
  manualSortBy = false,
  totalRows,
  setServerParams,
  setSelectedRows,
  initialState,
  isValidating,
  toggleRows,
  ...rest
}) => {
  const columnsMemo = useMemo(() => columns ?? [], [columns]);
  const dataMemo = useMemo(() => data ?? [], [data]);

  const tableInstance = useTable(
    {
      columns: columnsMemo,
      data: dataMemo,
      filterTypes,
      manualPagination,
      manualFilters,
      manualSortBy,
      autoResetPage: false,
      autoResetGlobalFilter: false,
      autoResetFilters: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      meta,
      initialState,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      // if (setSelectedRows) {
      //   hooks.visibleColumns.push((columns) => [
      //     {
      //       id: "selection",
      //       Header: ({ getToggleAllRowsSelectedProps }) => (
      //         <div>
      //           <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
      //         </div>
      //       ),
      //       Cell: ({ row }) => (
      //         <div>
      //           <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      //         </div>
      //       ),
      //     },
      //     ...columns,
      //   ]);
      // }
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    setAllFilters,
    setSortBy,
    prepareRow,
    selectedFlatRows,
    toggleAllPageRowsSelected,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize, filters, sortBy } = state;
  const [serverPageIndex, setServerPageIndex] = useState(pageIndex);

  const totalLocalRows = tableInstance.globalFilteredRows.length;

  useEffect(() => toggleAllPageRowsSelected(false), [toggleRows]);

  useEffect(
    () =>
      setSelectedRows &&
      setSelectedRows(selectedFlatRows.map((x) => x.original)),
    [selectedFlatRows]
  );

  useEffect(
    () =>
      setServerParams &&
      setServerParams((state) => ({
        ...state,
        filters,
        sortBy,
        pageSize,
        pageIndex: serverPageIndex,
      })),
    [filters, sortBy, serverPageIndex, pageSize]
  );

  useEffect(() => {
    if (pageIndex >= pageCount) {
      gotoPage(0);
    }
  }, [pageIndex, pageCount]);

  return (
    <Card {...rest}>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title mt-2 mb-2">{title}</h4>
        <div className="flex space-x-3 items-center rtl:space-x-reverse">
          {isValidating && (
            <Icon
              icon={"heroicons:arrow-path"}
              className={"animate-spin"}
              style={{ fontSize: "24px" }}
            />
          )}
          {ActionComponent}
          <NewButton
            buttonProps={{
              name: "Limpiar Filtros",
              icon: "heroicons-outline:backspace",
              className: "btn-dark btn-sm rounded-[999px]",
            }}
            onClick={() => {
              setGlobalFilter(undefined);
              setAllFilters([]);
              setSortBy([]);
            }}
          />
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden ">
            <table
              className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
              {...getTableProps}
            >
              <thead className="bg-slate-200 dark:bg-slate-700">
                {headerGroups.map((headerGroup) => {
                  const { key, ...restHeaderGroupProps } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...restHeaderGroupProps}>
                      {headerGroup.headers.map((column) => {
                        const { key, ...restColumn } = column.getHeaderProps(
                          column.getSortByToggleProps()
                        );
                        return (
                          <th
                            key={key}
                            {...restColumn}
                            scope="col"
                            className=" table-th "
                          >
                            <span className="flex flex-row items-center">
                              <div className="mr-2">
                                {column.render("Header")}
                              </div>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <Icon icon="heroicons:chevron-down" />
                                ) : (
                                  <Icon icon="heroicons:chevron-up" />
                                )
                              ) : column.canSort ? (
                                <Icon icon="heroicons:chevron-up-down" />
                              ) : (
                                ""
                              )}
                            </span>
                            {column.canFilter && column.Filter
                              ? column.render("Filter")
                              : null}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody
                className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                {...getTableBodyProps}
              >
                {page.map((row) => {
                  prepareRow(row);
                  const { key, ...restRowProps } = row.getRowProps();
                  return (
                    <tr key={key} {...restRowProps}>
                      {row.cells.map((cell) => {
                        const { key, ...restCellProps } = cell.getCellProps();
                        return (
                          <td
                            key={key}
                            {...restCellProps}
                            className="table-td normal-case"
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
        <div className=" flex items-center space-x-3 rtl:space-x-reverse">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 ">
            Registros por página:
          </span>
          <select
            className="form-control py-2 w-max"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        {manualPagination ? (
          <ManualPagination
            totalRows={totalRows}
            setServerPageIndex={setServerPageIndex}
            serverPageIndex={serverPageIndex}
            pageSize={pageSize}
          />
        ) : (
          <ul className="flex items-center space-x-3 rtl:space-x-reverse flex-wrap">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>{`${Math.min(
                pageIndex * pageSize + 1,
                totalLocalRows
              )} - ${Math.min(
                (pageIndex + 1) * pageSize,
                totalLocalRows
              )}`}</span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {` de ${totalLocalRows}`}
              </span>
            </span>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-left-solid" />
              </button>
            </li>

            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>
                {Math.min(pageIndex + 1, pageCount)} de {pageCount}
              </span>
            </span>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={nextPage}
                disabled={!canNextPage}
              >
                <Icon icon="heroicons:chevron-right-solid" />
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        )}
      </div>
    </Card>
  );
};

export default BaseTable;
