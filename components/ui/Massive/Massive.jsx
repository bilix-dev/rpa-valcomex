"use client";

import React, { useRef, useState } from "react";
import Card from "@/components/ui/Card";
import useSWRPost from "@/hooks/useSWRPost";
import { Icon } from "@iconify/react";
import Tooltip from "../Tooltip";

import useAuth from "@/hooks/useAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "../Button";
import { alerts, getDataFromWorksheetClient } from "@/helpers/helper";

import * as ExcelJS from "exceljs";
import ExcelModal from "../ExcelModal";
import Alert from "../Alert";
import Fileinput from "../Fileinput";
import CustomTable from "../CustomTable";

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
                          const { titles, data } = getDataFromWorksheetClient(
                            document.getWorksheet(1)
                          );
                          setExcel({
                            headers: titles,
                            data: data.map((d) => {
                              const row = titles.map((h) => d[h]);
                              return row;
                            }),
                          });
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

          {excel != null && (
            <CustomTable
              headers={["ÍNDICE", ...excel.headers]}
              data={excel.data.map((x, i) => [i + 1, ...x])}
            />
          )}

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
