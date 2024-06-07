import { Container, ServiceOrder } from "@/database/models";
import { CONTAINER_STATUS } from "@/helpers/helper";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request) {
  const headersList = headers();
  const operatorId = headersList.get("operatorId");

  const containers = await Container.findAll({
    where: {
      status: CONTAINER_STATUS.PENDIENTE,
    },
    include: [
      {
        model: ServiceOrder,
        required: true,
        where: {
          operatorId,
        },
      },
    ],
  });
  return NextResponse.json(containers);
}
