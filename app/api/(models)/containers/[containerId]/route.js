import {
  Container,
  ContainerEndpoint,
  Rpa,
  connection,
} from "@/database/models";
import { ENDPOINTS_KEYS } from "@/helpers/helper";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function DELETE(request, { params }) {
  const id = params.containerId;
  const container = await Container.destroy({ where: { id } });
  return NextResponse.json(container);
}

export async function PUT(request, { params }) {
  const id = params.containerId;
  const data = await request.json();
  const t = await connection.transaction();

  try {
    const container = await Container.findByPk(id, { transaction: t });
    const currentEndpoint = container.endpoint;

    await container.update(data, {
      transaction: t,
    });

    //Cambio, destruir y agregar endpoints
    if (data.endpoint != currentEndpoint) {
      await ContainerEndpoint.destroy({
        where: {
          containerId: container.id,
        },
        transaction: t,
      });

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
    return NextResponse.json(container);
  } catch (e) {
    await t.rollback();
    return NextResponse.json(e);
  }
}
