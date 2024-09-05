import useAxios from "@/hooks/useAxios";
import containerValidator from "container-validator";
import dayjs from "dayjs";
// import duration from "dayjs/plugin/duration";
import es from "dayjs/locale/es";

dayjs.locale(es);
// dayjs.extend(duration);

export const PREFIX = "+56";

export const GRANTS = Object.freeze({
  view: "view",
  edit: "edit",
  delete: "delete",
});

export const WS_STATUS = Object.freeze({
  disconnected: "disconnected",
  connected: "connected",
  error: "error",
});

export const OS_STATUS = Object.freeze({
  VACIO: "vacía",
  CERRADA: "cerrada",
  ABIERTA: "abierta",
});

export const CONTAINER_STATUS = Object.freeze({
  PENDIENTE: "pendiente",
  MATCH: "match",
  PROCESANDO: "procesando",
  TRAMITADO: "tramitado",
  FINALIZADO: "finalizado",
  ANULADO: "anulado",
  ESPERA: "espera",
  ERROR: "error",
});

export const ENDPOINTS = Object.freeze({
  pc: "Puerto Central (San Antonio)",
  sti: "STI (San Antonio)",
  silogport: "Silogport (Valparaíso)",
  tps: "TPS (San Antonio)",
  silogport_tps: "Silogport → TPS (Valparaíso)",
});

export const SIZE = Object.freeze({
  20: 20,
  40: 40,
});

export const COUNTRY = Object.freeze({
  ARGENTINA: "ARGENTINA",
  CHILE: "CHILE",
});

export const CONTAINER_TYPE = Object.freeze({
  CONT20: "CONT20",
  CONT40: "CONT40",
  REEFER20: "REEFER20",
  REEFER40: "REEFER40",
  CONTNOESP: "CONTNOESP",
});

export const ENDPOINTS_KEYS = Object.keys(ENDPOINTS)
  .map((x) => ({ [x]: x }))
  .reduce((x, y) => ({ ...x, ...y }), {});

export const hasAccess = (role) => (code, type) => {
  if (role?.super) return true;
  return role?.grants?.find((x) => x.code == code)?.role_grant[type] ?? false;
};

export const bufferToFile = (jsonBuffer, name = "file", params = {}) => {
  try {
    const blob = new Blob([Buffer.from(jsonBuffer)]);
    const file = new File([blob], name, params);
    return Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
  } catch (e) {
    return null;
  }
};

export const fileToBuffer = async (file) => {
  try {
    return Buffer.from(await file.arrayBuffer());
  } catch (e) {
    return null;
  }
};

export const dateDiff = (start, end) => {
  return dayjs(end).diff(dayjs(start), "day");
};

export const toFormatDateTime = (date, hours = true) =>
  dayjs(date).format(`DD-MM-YYYY${hours ? " HH:mm" : ""}`);

export const toFormatDateTime2 = (date, hours = true) =>
  dayjs(date).format(`DD/MM/YYYY${hours ? " HH:mm" : ""}`);

export const toFormatDate = (date) =>
  dayjs(date).format("dddd D [de] MMMM [del] YYYY");

export const MoneyCLP = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "CLP",
});

export const MoneyUSD = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "USD",
});

export const getDefaultData =
  (url, callBack = (response) => response) =>
  async () => {
    const axios = useAxios();
    const response = await axios.get(url);
    return callBack(response);
  };

export function validateEmail(value) {
  var input = document.createElement("input");
  input.type = "email";
  input.required = true;
  input.value = value;
  return typeof input.checkValidity === "function"
    ? input.checkValidity()
    : /\S+@\S+\.\S+/.test(value);
}

export const toFormatContainer = (value) =>
  value?.substring(0, 10) + "-" + value?.substring(10, 11);

export const getDocumentNumber = async (operatorId, customId) => {
  const fetcher = useAxios();
  return fetcher.get(`/helpers/${operatorId}`, { params: { customId } });
};

export const getLastDays = (date, days = 30) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    dates.push(dayjs(date).subtract(i, "day").format("YYYY-MM-DD"));
  }
  return dates;
};

export function excelDateToJSDate(serial) {
  var utc_days = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;

  var total_seconds = Math.floor(86400 * fractional_day);

  var seconds = total_seconds % 60;

  total_seconds -= seconds;

  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}

export const alerts = {
  success: {
    show: true,
    type: "success",
    data: "Se ha cargado el archivo correctamente.",
    icon: "akar-icons:double-check",
  },
  error: {
    show: true,
    type: "danger",
    data: "No se ha podido cargar el archivo, compruebe que el formato sea el correcto.",
    icon: "akar-icons:x-small",
  },
  noValid: {
    show: true,
    type: "danger",
    data: "El archivo no pudo ser procesado, compruebe que el formato sea el correcto.",
    icon: "akar-icons:x-small",
  },
};

export const toContainerStatus = (status) => {
  switch (status) {
    case "OP":
      return "Operativo [OP]";
    case "DM":
      return "Dañado [DM]";
    default:
      return "";
  }
};

export const getDataFromWorksheetClient = (worksheet) => {
  // data
  let titles = [];
  let data = [];

  // excel to json converter (only the first sheet)
  worksheet.eachRow((row, rowNumber) => {
    // rowNumber 0 is empty
    if (rowNumber > 0) {
      // get values from row
      let rowValues = row.values;
      // remove first element (extra without reason)
      rowValues.shift();
      // titles row
      if (rowNumber === 1) titles = rowValues;
      // table data
      else {
        // create object with the titles and the row values (if any)
        let rowObject = {};
        for (let i = 0; i < titles.length; i++) {
          let title = titles[i];
          let value = rowValues[i] ? rowValues[i] : "";
          rowObject[title] = value;
        }
        data.push(rowObject);
      }
    }
  });
  return { titles, data };
};

export const dayMessage = (n) => {
  switch (n) {
    case 1:
      return `Queda ${n} día.`;
    case 0:
      return `La licencia expíra hoy.`;
    default:
      return `Quedan ${n} días.`;
  }
};

export const passwordMessage = (n) => {
  switch (n) {
    case 1:
      return `Queda ${n} día.`;
    case 0:
      return `La contraseña expíra hoy.`;
    default:
      return `Quedan ${n} días.`;
  }
};

export const addDays = (date, days) =>
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

export const EXCEL_DICTIONARY = {
  CONTENEDOR: {
    valid_endpoints: [
      ENDPOINTS_KEYS.pc,
      ENDPOINTS_KEYS.sti,
      ENDPOINTS_KEYS.silogport_tps,
    ],
    key: "name",
    type: "CNT",
    value: "Texto",
    required: true,
    test: (value) => {
      let validator = new containerValidator();
      if (value == undefined) return false;
      return validator.isValid(value.replace("-", ""));
    },
    format: (value) => value.replace("-", ""),
  },
  OS: {
    valid_endpoints: [
      ENDPOINTS_KEYS.pc,
      ENDPOINTS_KEYS.sti,
      ENDPOINTS_KEYS.silogport_tps,
    ],
    key: "code",
    value: "Texto",
    type: "OS",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  BOOKING: {
    valid_endpoints: [
      ENDPOINTS_KEYS.pc,
      ENDPOINTS_KEYS.sti,
      ENDPOINTS_KEYS.silogport_tps,
    ],
    key: "booking",
    value: "Texto",
    type: "OS",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  RUT: {
    valid_endpoints: [
      ENDPOINTS_KEYS.pc,
      ENDPOINTS_KEYS.sti,
      ENDPOINTS_KEYS.silogport_tps,
    ],
    key: "clientRut",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value.replace("-", "").replace(".", ""),
  },
  PESO: {
    valid_endpoints: [ENDPOINTS_KEYS.pc, ENDPOINTS_KEYS.sti],
    key: "weight",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  TRANSPORTISTA: {
    valid_endpoints: [ENDPOINTS_KEYS.pc],
    key: "dispatcher",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value.replace("-", "").replace(".", ""),
  },
  CONSIGNATARIO: {
    valid_endpoints: [ENDPOINTS_KEYS.silogport_tps],
    key: "consignee",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  PESO_VGM_VERIFIER: {
    valid_endpoints: [ENDPOINTS_KEYS.silogport_tps],
    key: "vgmWeightVerifier",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  PESO_SOLO_CARGA: {
    valid_endpoints: [ENDPOINTS_KEYS.silogport_tps],
    key: "weightChargeOnly",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  TIPO_DE_BULTO: {
    valid_endpoints: [ENDPOINTS_KEYS.silogport_tps],
    key: "containerType",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  ISO_CODE: {
    valid_endpoints: [ENDPOINTS_KEYS.silogport_tps],
    key: "isoCode",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  NUM_DE_CARTA_DE_PORTE: {
    valid_endpoints: [ENDPOINTS_KEYS.silogport_tps],
    key: "numCartaPorte",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  NAVE: {
    valid_endpoints: [ENDPOINTS_KEYS.silogport_tps],
    key: "ship",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  PESO_VGM: {
    valid_endpoints: [ENDPOINTS_KEYS.sti, ENDPOINTS_KEYS.silogport_tps],
    key: "vgmWeight",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  OPERACION: {
    valid_endpoints: [ENDPOINTS_KEYS.sti],
    key: "operation",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  NAVIERA: {
    valid_endpoints: [ENDPOINTS_KEYS.sti],
    key: "shippingCompany",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
  RAZON_SOCIAL: {
    valid_endpoints: [ENDPOINTS_KEYS.sti],
    key: "businessName",
    value: "Texto",
    type: "CNT",
    required: true,
    test: (value) => true,
    format: (value) => value,
  },
};
