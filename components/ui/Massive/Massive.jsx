"use client";

import React, { Fragment, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import useSWRPost from "@/hooks/useSWRPost";
import { Icon } from "@iconify/react";
import Tooltip from "../Tooltip";

import useAuth from "@/hooks/useAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "../Button";
import {
  ENDPOINTS,
  ENDPOINTS_KEYS,
  EXCEL_DICTIONARY,
  alerts,
  getDataFromWorksheetClient,
} from "@/helpers/helper";

import * as ExcelJS from "exceljs";
import ExcelModal from "../ExcelModal";
import Alert from "../Alert";
import Fileinput from "../Fileinput";
import CustomTable from "../CustomTable";
import { Tab } from "@headlessui/react";

const Massive = () => {
  const [excel, setExcel] = useState(null);
  const [alert, setAlert] = useState(null);
  const ref = useRef();
  const { operatorId } = useAuth();
  const { trigger } = useSWRPost(
    `/massive`,
    {},
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const schema = yup
    .object({
      file: yup.mixed().required("El archivo es requerido"),
    })
    .required();

  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Card
      title={`Carga Masiva OS`}
      headerslot={
        <div className="flex gap-2">
          <Tooltip
            content="Formato Excel"
            placement="top"
            arrow
            animation="fade"
          >
            <a
              className="action-btn btn-success"
              href={`/excel/PLANTILLA_RPA.xlsx`}
              download={`PLANTILLA_RPA.xlsx`}
            >
              <Icon icon="heroicons:document-plus" />
            </a>
          </Tooltip>
          <ExcelModal
            title={"Información Adicional"}
            OpenButtonComponent={({ onClick }) => (
              <Tooltip
                content="Información Adicional"
                placement="top"
                arrow
                animation="fade"
              >
                <button className="action-btn" onClick={onClick}>
                  <Icon icon="heroicons:question-mark-circle" />
                </button>
              </Tooltip>
            )}
          />
        </div>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit(async (data) => {
          const formData = new FormData();
          formData.append("file", data.file);
          formData.append("operatorId", operatorId);
          const response = await trigger(formData);
          if (response.data.status == 0) {
            setAlert(alerts.success);
            setValue("file", undefined);
            setExcel(null);
            ref.current.value = "";
          } else {
            setAlert({
              ...alerts.noValid,
              data: (
                <div className="flex flex-col gap-1">
                  <span>{alerts.noValid.data}</span>
                  <span className="italic">
                    {"Error: " + response.data.message}
                  </span>
                </div>
              ),
            });
          }
        })}
      >
        <div className="space-y-3">
          {alert?.show && (
            <Alert
              toggle={() => setAlert((state) => ({ ...state, show: false }))}
              icon={alert.icon}
              className={`light-mode alert-${alert.type}`}
            >
              {alert.data}
            </Alert>
          )}
          <div>
            <label className="block capitalize form-label">Archivo</label>
            <Controller
              control={control}
              name={"file"}
              render={({ field: { value, onChange } }) => {
                return (
                  <Fileinput
                    currentRef={ref}
                    name="file"
                    accept=".xls,.xlsx,.csv"
                    placeholder={"Buscar o arrastrar..."}
                    label={
                      <div className="flex gap-4 items-center">
                        {excel ? (
                          <div
                            className="flex gap-2 items-center"
                            onClick={(e) => {
                              setExcel(null);
                              onChange(null);
                              ref.current.value = "";
                              e.preventDefault();
                            }}
                          >
                            <Icon icon="heroicons-outline:x-mark" />
                            <span className="label">Limpiar...</span>
                          </div>
                        ) : (
                          <div className="flex gap-2 items-center">
                            <Icon icon="heroicons-outline:paper-clip" />
                            <span className="label">Adjuntar...</span>
                          </div>
                        )}
                      </div>
                    }
                    badge
                    selectedFile={value}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file != undefined) {
                        try {
                          const workbook = new ExcelJS.Workbook();
                          const document = await workbook.xlsx.load(
                            await file.arrayBuffer()
                          );

                          let aux = {};
                          document.eachSheet((ws, i) => {
                            if (
                              ENDPOINTS_KEYS[ws.name] != null &&
                              ENDPOINTS_KEYS[ws.name] != ENDPOINTS_KEYS.tps &&
                              ENDPOINTS_KEYS[ws.name] !=
                                ENDPOINTS_KEYS.silogport
                            ) {
                              const { titles, data } =
                                getDataFromWorksheetClient(ws);
                              aux = {
                                ...aux,
                                [ws.name]: {
                                  headers: titles,
                                  data: data.map((d) => {
                                    const row = titles.map((h) => d[h]);
                                    return row;
                                  }),
                                },
                              };
                            }
                          });
                          setExcel(aux);
                          setAlert(null);
                          onChange(file);
                        } catch (e) {
                          setAlert(alerts.error);
                          setExcel(null);
                          onChange(null);
                        }
                      } else {
                        setExcel(null);
                        onChange(null);
                      }
                    }}
                  />
                );
              }}
            />
            {errors?.file && (
              <div className={` mt-2 text-danger-500 block text-sm`}>
                {errors?.file.message}
              </div>
            )}
          </div>

          {excel && (
            <div className="mt-2">
              <Tab.Group>
                <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
                  {Object.keys(excel).map((title, i) => (
                    <Tab as={Fragment} key={i}>
                      {({ selected }) => (
                        <button
                          className={` text-sm font-medium mb-7 capitalize bg-white
             dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2
              transition duration-150 before:transition-all before:duration-150 relative 
              before:absolute before:left-1/2 before:bottom-[-6px] before:h-[1.5px] before:bg-primary-500 
              before:-translate-x-1/2 
              
              ${
                selected
                  ? "text-primary-500 before:w-full"
                  : "text-slate-500 before:w-0 dark:text-slate-300"
              }
              `}
                        >
                          {ENDPOINTS[title]}
                        </button>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels>
                  {Object.values(excel).map((entry, i) => {
                    let indexes = entry.headers
                      .map((e, i) =>
                        !Object.keys(EXCEL_DICTIONARY).includes(e)
                          ? i
                          : undefined
                      )
                      .filter((x) => x !== undefined);

                    const headers = entry.headers.filter(
                      (x, i) => !indexes.includes(i)
                    );

                    const data = entry.data.map((x) =>
                      x.filter((x, i) => !indexes.includes(i))
                    );
                    return (
                      <Tab.Panel key={i}>
                        <CustomTable
                          key={i}
                          headers={["ÍNDICE", ...headers]}
                          data={data.map((x, i) => [i + 1, ...x])}
                        />
                      </Tab.Panel>
                    );
                  })}
                </Tab.Panels>
              </Tab.Group>
            </div>
          )}

          {/* 
          {excel && (
            <CustomTable
              headers={["ÍNDICE", ...excel.headers]}
              data={excel.data.map((x, i) => [i + 1, ...x])}
            />
          )} */}

          <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
            <Button
              type="submit"
              text="Guardar"
              isLoading={isSubmitting}
              className="btn btn-dark"
            />
          </div>
        </div>
      </form>
    </Card>
  );
};

export default Massive;
