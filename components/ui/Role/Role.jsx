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
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import useSWRPost from "@/hooks/useSWRPost";
import { useSWRConfig } from "swr";
import SkeletionTable from "@/components/skeleton/Table";
import Checkbox from "@/components/ui/Checkbox";
import useAuth from "@/hooks/useAuth";
import useSWRDelete from "@/hooks/useSWRDelete";
import useSWRPut from "@/hooks/useSWRPut";
import { GRANTS } from "@/helpers/helper";
import LoadingIcon from "@/components/ui/LoadingIcon";
import { toast } from "react-toastify";

const DeleteModal = ({ data }) => {
  const { operatorId } = useAuth();
  const { isMutating, trigger } = useSWRDelete(`/roles/${data.id}`);
  const { mutate } = useSWRConfig();
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
          await mutate([`/roles/operator/${operatorId}`]);
        }}
      >
        <LoadingIcon icon="heroicons:trash" isLoading={isMutating} />
      </button>
    </Tooltip>
  );
};

const CrudModal = ({ OpenButtonComponent, title, data = {} }) => {
  const { operatorId } = useAuth();
  const columns = useMemo(
    () => [
      {
        label: "Tipo",
        checkbox: false,
      },
      {
        label: "Permiso",
        checkbox: false,
      },
      {
        label: "Ver",
        checkbox: true,
        type: GRANTS.view,
      },
      {
        label: "Editar",
        checkbox: true,
        type: GRANTS.edit,
      },
      {
        label: "Borrar",
        checkbox: true,
        type: GRANTS.delete,
      },
    ],
    []
  );

  const [open, isOpen] = useState(false);
  const { mutate } = useSWRConfig();
  const { data: response, isLoading } = useSWRGet("/grants");
  const schema = yup
    .object({
      name: yup.string().required("Rol requerido"),
    })
    .required();

  const { trigger } = data.id
    ? useSWRPut(`/roles/${data.id}`)
    : useSWRPost(`/roles`);

  const [checkedList, setCheckedList] = useState([]);

  const {
    register,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "grants",
  });

  useEffect(() => {
    if (isLoading == false && open) {
      response?.data.forEach(({ id, ...grant }) => {
        let aux = data?.grants?.find(
          (x) => x.role_grant?.grantId == id
        )?.role_grant;

        setCheckedList((state) => [
          ...state,
          { type: "view", id: `view.${id}`, checked: aux?.view ?? false },
          { type: "edit", id: `edit.${id}`, checked: aux?.edit ?? false },
          { type: "delete", id: `delete.${id}`, checked: aux?.delete ?? false },
        ]);

        append(
          aux
            ? {
                ...grant,
                grantId: id,
                view: aux.view,
                edit: aux.edit,
                delete: aux.delete,
              }
            : { ...grant, grantId: id }
        );
      });
    }
  }, [isLoading, open]);

  const HandleClick = ({ target }) => {
    let aux = checkedList.map((x) =>
      x.id == target.id ? { ...x, checked: target.checked } : x
    );
    setCheckedList(aux);
  };

  const HandleClickAll = ({ target }) => {
    let aux = checkedList.map((x) =>
      x.type == target.id ? { ...x, checked: target.checked } : x
    );

    aux
      .filter((x) => x.type == target.id)
      .forEach((x, i) => {
        setValue(`grants.[${i}].${x.type}`, target.checked);
      });
    setCheckedList(aux);
  };

  return (
    <>
      <OpenButtonComponent
        onClick={() => {
          remove(fields.map((x) => x.id));
          reset({ ...data, grants: [] });
          setCheckedList([]);
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
            await mutate([`/roles/operator/${operatorId}`]);
            isOpen(false);
          })}
        >
          <Textinput
            label="Rol"
            name="name"
            type="text"
            placeholder="Rol"
            register={register}
            error={errors?.name}
          />

          {isLoading ? (
            <SkeletionTable count={10} />
          ) : (
            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
              <thead className="bg-slate-200 dark:bg-slate-700">
                <tr>
                  {columns.map((column, i) => (
                    <th key={i} scope="col" className=" table-th ">
                      {column.checkbox ? (
                        <Checkbox
                          id={column.type}
                          label={
                            <div className=" ml-2 uppercase text-xs ">
                              {column.label}
                            </div>
                          }
                          onChange={HandleClickAll}
                          checked={checkedList
                            .filter((x) => x.type == column.type)
                            .every((x) => x.checked)}
                        />
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                {fields.map((row, i) => (
                  <tr key={row.id}>
                    <td className="table-td">{row.type}</td>
                    <td className="table-td">{row.name}</td>
                    <td className="table-td">
                      {
                        <Checkbox
                          register={register(`grants.[${i}].view`)}
                          id={`view.${row.grantId}`}
                          checked={
                            checkedList.find(
                              (x) => x.id == `view.${row.grantId}`
                            )?.checked
                          }
                          onChange={HandleClick}
                        />
                      }
                    </td>
                    <td className="table-td">
                      {
                        <Checkbox
                          register={register(`grants.[${i}].edit`)}
                          id={`edit.${row.grantId}`}
                          checked={
                            checkedList.find(
                              (x) => x.id == `edit.${row.grantId}`
                            )?.checked
                          }
                          onChange={HandleClick}
                        />
                      }
                    </td>
                    <td className="table-td">
                      {
                        <Checkbox
                          register={register(`grants.[${i}].delete`)}
                          id={`delete.${row.grantId}`}
                          checked={
                            checkedList.find(
                              (x) => x.id == `delete.${row.grantId}`
                            )?.checked
                          }
                          onChange={HandleClick}
                        />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </form>
      </Modal>
    </>
  );
};

const Role = () => {
  const { operatorId, hasRoleAccess } = useAuth();
  const {
    data: response,
    isLoading,
    isValidating,
  } = useSWRGet(`/roles/operator/${operatorId}`);

  const columns = useMemo(
    () => [
      {
        Header: "Opciones",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div className="flex space-x-3 rtl:space-x-reverse">
              {!row.original.super && (
                <>
                  {hasRoleAccess("roles", "edit") && (
                    <CrudModal
                      title="Editar"
                      data={row.original}
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
                  {hasRoleAccess("roles", "delete") && (
                    <DeleteModal data={row.original} />
                  )}
                </>
              )}
              <RegistryInfo data={row.original} />
            </div>
          );
        },
      },
      {
        Header: "Rol",
        accessor: "name",
      },
      {
        Header: "Maestro",
        accessor: (user) => (user.super ? "Si" : "No"),
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
        Header: "Usuarios",
        accessor: (row) => row.users.length,
      },
    ],
    []
  );

  const actionMenu = useMemo(
    () => (
      <div>
        {hasRoleAccess("roles", "edit") && (
          <CrudModal title={"Crear"} OpenButtonComponent={NewButton} />
        )}
      </div>
    ),
    []
  );

  if (isLoading) {
    return <SkeletionTable count={10} />;
  }

  return (
    <BaseTable
      title="Roles"
      columns={columns}
      data={response?.data}
      ActionComponent={actionMenu}
      isValidating={isValidating}
    />
  );
};

export default Role;
