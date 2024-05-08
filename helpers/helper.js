import useAxios from "@/hooks/useAxios";
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
