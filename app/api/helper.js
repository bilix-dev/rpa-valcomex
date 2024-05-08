import Jwt from "jsonwebtoken";
import { VerificationToken } from "@/database/models";
import { sendEmail } from "@/configs/email";
import { render } from "@react-email/components";
import RegisterMail from "@/emails/RegisterMail";
import { Op, Sequelize } from "sequelize";
import * as ExcelJS from "exceljs";

export const getOrigin = (origin) =>
  process.env.NODE_ENV == "development"
    ? origin
    : process.env.NEXTAUTH_URL ?? origin;

export const sendUserCreationMail = async (request, userVerification) => {
  const token = generateToken(
    userVerification.id,
    86400 * process.env.EMAIL_VERIFICATION_DAYS_LIMIT
  );

  const url = `${getOrigin(request.nextUrl.origin)}/register/${
    token.identifier
  }/${token.token}`;
  await sendEmail({
    to: userVerification.email,
    subject: "Invitación a registrarse",
    html: render(RegisterMail({ resetPasswordLink: url })),
  });
  return token;
};

export const generateToken = (identifier, duration) => {
  const iat = Math.floor(new Date() / 1000);
  const exp = iat + duration;
  const token = Jwt.sign({ identifier, iat, exp }, process.env.NEXTAUTH_SECRET);
  return { token, identifier, expires: new Date(exp * 1000) };
};

export const checkToken = (token, identifier) => {
  try {
    const decoded = Jwt.verify(token, process.env.NEXTAUTH_SECRET);
    if (decoded.identifier != identifier)
      throw {
        name: "JsonWebTokenValidationError",
        message: "User does not match with token identifier",
      };
    return { valid: true, error: {} };
  } catch (e) {
    return {
      valid: false,
      error: e,
    };
  }
};

export const generateResetToken = async (identifier) => {
  //Borrar todos los registros antiguos asociados al usuario para que no se dupliquen los links
  await VerificationToken.destroy({
    where: { identifier },
  });
  //Genera un nuevo token
  var verificationToken = await VerificationToken.create({
    ...generateToken(
      identifier,
      process.env.CHANGE_PASSWORD_MINUTES_LIMIT * 60
    ),
  });
  return verificationToken;
};

export const checkResetToken = async (token, identifier) => {
  const foundToken = await VerificationToken.findByPk(token);
  return checkToken(foundToken?.token, identifier);
};

export const excelDocumentFormat = (worksheet) => {
  worksheet.eachRow((row, i) => {
    //header
    if (i == 1) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffd3d3d3" },
        };
        cell.font = { bold: true };
        cell.alignment = { vertical: "center", horizontal: "center" };
        cell.border = {
          top: { style: "double" },
          left: { style: "double" },
          bottom: { style: "double" },
          right: { style: "double" },
        };
      });
    } else {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column["eachCell"]({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length + 3 : 10;
      if (cell.type === ExcelJS.ValueType.Date) {
        maxLength = 20;
      } else if (columnLength > maxLength) {
        maxLength = columnLength + 3;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength;
  });
  const rowCount = worksheet.rowCount;
  const footer = worksheet.getRow(rowCount + 1);
  footer.getCell(1).value = `Registros: ${rowCount - 1}`;
  footer.getCell(1).font = { bold: true };
  footer.getCell(1).border = {
    top: { style: "double" },
    left: { style: "double" },
    bottom: { style: "double" },
    right: { style: "double" },
  };
  footer.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "ffd3d3d3" },
  };
};

export const getDataFromWorksheet = (worksheet) => {
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
