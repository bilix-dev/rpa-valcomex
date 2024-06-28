import { headers } from "next/headers";
import { Container, ContainerMatch } from "@/database/models";
import { CONTAINER_STATUS } from "@/helpers/helper";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const headersList = headers();
  const userName = headersList.get("userName");
  const containerId = params.containerId;
  const container = await Container.findByPk(containerId);
  await container.update({
    status: CONTAINER_STATUS.PENDIENTE,
    matchDate: null,
    updatedBy: userName,
  });
  await ContainerMatch.destroy({ where: { containerId } });
  return NextResponse.json(container);
}

export async function PUT(request, { params }) {
  const headersList = headers();
  const userName = headersList.get("userName");
  const containerId = params.containerId;
  const container = await Container.findByPk(containerId);
  await container.update({
    status: CONTAINER_STATUS.FINALIZADO,
    endDate: new Date(),
    updatedBy: userName,
  });
  return NextResponse.json(container);
}
