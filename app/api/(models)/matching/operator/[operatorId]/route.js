import {
  Container,
  ContainerEndpoint,
  ContainerMatch,
  Rpa,
  ServiceOrder,
  User,
} from "@/database/models";
import { CONTAINER_STATUS } from "@/helpers/helper";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function GET(request, { params }) {
  const id = params.operatorId;
  const containers = await Container.findAll({
    where: {
      status: {
        [Op.notIn]: [CONTAINER_STATUS.ANULADO, CONTAINER_STATUS.FINALIZADO],
      },
    },
    include: [
      {
        model: ServiceOrder,
        required: true,
        where: {
          operatorId: id,
        },
      },
      {
        model: ContainerEndpoint,
        include: {
          model: Rpa,
        },
      },
      {
        model: ContainerMatch,
        include: {
          model: User,
        },
      },
    ],
  });
  return NextResponse.json(containers);
}
