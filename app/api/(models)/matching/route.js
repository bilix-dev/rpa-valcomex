import {
  Container,
  ContainerEndpoint,
  ContainerMatch,
  Operator,
  Rpa,
  ServiceOrder,
  User,
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
      { model: ContainerMatch, include: [{ model: User }] },
      { model: ServiceOrder, include: [{ model: Operator }] },
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
