"use client";
import { useState } from "react";
import Modal from "./Modal";
import CustomTable from "./CustomTable";
const data = [
  ["type", "Tipo de Ingreso", "DESEMBARQUE o TRASPASO", "Texto"],
  // ["entryCountryDate", "Fecha ingreso al país", "DD-MM-AAAA HH:mm", "Fecha"],
  // [
  //   "entryDepositDate",
  //   "Fecha entrada al deposito",
  //   "DD-MM-AAAA HH:mm",
  //   "Fecha",
  // ],
  // ["container", "Contenedor", "sin puntos ni guión", "Texto"],
  // ["custom", "Código Aduana", "--", "Numérico"],
  // ["eir", "EIR", "--", "Texto"],
  // ["originTatc", "Origen T.A.T.C", "--", "Texto"],
  // ["destinyTatc", "Destino T.A.T.C", "--", "Texto"],
  // ["cntType", "Tipo Contenedor", "--", "Texto"],
  // ["containerSize", "Tamaño Contenedor", "20 o 40", "Numérico"],
  // ["inDocument", "Documento Ingreso", "--", "Texto"],
  // ["inPort", "Puerto Ingreso", "--", "Texto"],
  // ["issuerTatc", "T.A.T.C Emisor", "--", "Texto"],
  // ["inTatc", "T.A.T.C Ingreso", "--", "Texto"],
  // ["transferDate", "Fecha Traspaso", "DD-MM-AAAA", "Fecha"],
  // ["tara", "Tara", "--", "Numérico"],
  // ["manufacturingYear", "Año Fabricación", "--", "Numérico"],
  // ["containerStatus", "Estado Contenedor", "OP o DM", "Texto"],
  // ["bultoType", "Tipo Bulto", "*", "Numérico"],
  // ["deposit", "Lugar de Depósito", "*", "Numérico"],
  // ["fob", "Valor FOB", "--", "Decimal"],
  // ["cif", "Valor CIF", "--", "Decimal"],
];

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
          headers={["Atributo", "Descripcion", "Valor", "Tipo"]}
          data={data}
        />
      </Modal>
    </>
  );
};
