import { Container, ServiceOrder } from "@/database/models";
import { CONTAINER_STATUS } from "@/helpers/helper";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.operatorId;
  const containers = await Container.findAll({
    where: {
      status: CONTAINER_STATUS.PENDIENTE,
    },
    include: [
      {
        model: ServiceOrder,
        required: true,
        where: {
          operatorId: id,
        },
      },
    ],
  });
  return NextResponse.json(containers);
}
