"use client";
import { useState } from "react";
import Modal from "./Modal";
import CustomTable from "./CustomTable";
import { EXCEL_DICTIONARY } from "@/helpers/helper";
const excelData = () => {
  let data = [];
  for (const [k, v] of Object.entries(EXCEL_DICTIONARY)) {
    let row = [k, v.value, v.required ? "SI" : "NO"];
    data.push(row);
  }
  return data;
};

export default ({ OpenButtonComponent, title }) => {
  const [open, isOpen] = useState(false);
  return (
    <>
      <OpenButtonComponent onClick={() => isOpen(true)} />
      <Modal
        activeModal={open}
        onClose={() => {
          isOpen(false);
        }}
        title={title}
        labelClass="btn-outline-dark"
        uncontrol={false}
        className=" max-w-7xl "
      >
        <CustomTable
          title={"Formato Excel"}
          headers={["Atributo", "Tipo", "Obligatorio"]}
          data={excelData()}
        />
      </Modal>
    </>
  );
};
