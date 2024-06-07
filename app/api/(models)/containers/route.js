import {
  Container,
  ContainerEndpoint,
  Rpa,
  connection,
} from "@/database/models";
import { ENDPOINTS_KEYS } from "@/helpers/helper";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function POST(request) {
  const data = await request.json();
  const t = await connection.transaction();
  try {
    const container = await Container.create(data, { transaction: t });
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
    await t.commit();
    return NextResponse.json(container);
  } catch (e) {
    await t.rollback();
    return NextResponse.json(e);
  }
}
