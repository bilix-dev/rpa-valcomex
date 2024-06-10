import {
  Container,
  ContainerEndpoint,
  Rpa,
  ServiceOrder,
  //   CntTypes,
  //   Container,
  //   Custom,
  //   Deposit,
  //   Operator,
  //   Tatc,
  connection,
} from "@/database/models";

// import containerValidator from "container-validator";
import { NextResponse } from "next/server";
import * as ExcelJS from "exceljs";
import { getDataFromWorksheet } from "@/app/api/helper";
import { ENDPOINTS_KEYS, EXCEL_DICTIONARY } from "@/helpers/helper";
import { Op } from "sequelize";

export async function POST(request) {
  const t = await connection.transaction();
  try {
    const data = await request.formData();
    const operatorId = data.get("operatorId");
    const file = data.get("file");
    const workbook = new ExcelJS.Workbook();
    const document = await workbook.xlsx.load(await file.arrayBuffer());
    const { data: excelData } = getDataFromWorksheet(document.getWorksheet(1));

    let index = 0;
    excel: for (let row of excelData) {
      index++;
      let cnt_aux = {};
      let os_aux = {};
      //Mapeo de inputs
      row: for (const [k, v] of Object.entries(row)) {
        const aux = EXCEL_DICTIONARY[k];
        if (aux == null) continue;
        const { key, type, required, test } = aux;

        if (required && v.length == 0)
          throw new Error(`[${index},${k}] - Campo Obligatorio`);
        if (!test(v))
          throw new Error(`[${index},${k}] - Campo erroneo: '${v}' `);

        if (type == "OS") os_aux[key] = v;
        if (type == "CNT") cnt_aux[key] = v;
      }

      let os_found = await ServiceOrder.findOne({
        where: { code: os_aux.code },
        transaction: t,
      });
      //Si es nulo es por que no existe la os, crear y agregar contenedor dentro
      if (os_found == null) {
        //CREAR OS
        os_found = await ServiceOrder.create(
          { ...os_aux, operatorId },
          { transaction: t }
        );
      } else {
        //Checkea si se puede agregar nuevo contenedor
        const container = await Container.findOne({
          where: { name: cnt_aux.name, serviceOrderId: os_found.id },
          transaction: t,
        });

        if (container != null) {
          throw new Error(
            `[${index},CONTENEDOR] - Contenedor repetido: '${container.name}' `
          );
        }
      }

      //CREAR CONTENEDOR
      const container = await Container.create(
        {
          ...cnt_aux,
          serviceOrderId: os_found.id,
        },
        { transaction: t }
      );

      switch (container.endpoint) {
        //Caso especial
        case ENDPOINTS_KEYS.silogport_tps: {
          const rpas = await Rpa.findAll({
            where: {
              [Op.or]: [
                { code: ENDPOINTS_KEYS.silogport },
                { code: ENDPOINTS_KEYS.tps },
              ],
            },
            transaction: t,
          });
          if (rpas.length != 0)
            await ContainerEndpoint.bulkCreate(
              rpas.map((rpa) => ({
                rpaId: rpa.id,
                containerId: container.id,
                order: rpa.code == ENDPOINTS_KEYS.silogport ? 1 : 2,
              })),
              { transaction: t, individualHooks: true }
            );
          break;
        }
        //Caso estandar
        default: {
          const rpa = await Rpa.findOne({
            where: { code: container.endpoint },
            transaction: t,
          });
          if (rpa != null)
            await ContainerEndpoint.create(
              {
                rpaId: rpa.id,
                containerId: container.id,
              },
              { transaction: t }
            );
          break;
        }
      }
    }

    await t.commit();
    return NextResponse.json({
      status: 0,
    });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({
      status: 1,
      message: error.message,
    });
  }
}
