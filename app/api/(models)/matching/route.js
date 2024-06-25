import {
  Container,
  ContainerEndpoint,
  ContainerMatch,
  Rpa,
  ServiceOrder,
} from "@/database/models";
import { CONTAINER_STATUS } from "@/helpers/helper";
import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { sendDataAsync } from "../../helper";

export async function PUT(request, { params }) {
  const { ids } = await request.json();

  const containers = await Container.findAll({
    where: {
      id: { [Op.in]: ids },
    },
    include: [
      {
        model: ContainerEndpoint,
        include: { model: Rpa },
      },
      { model: ContainerMatch },
      { model: ServiceOrder },
    ],
  });

  for (const container of containers) {
    await container.update({
      status: CONTAINER_STATUS.ESPERA,
      waitingDate: new Date(),
    });
    sendDataAsync(container);
  }

  return NextResponse.json(containers);
}
