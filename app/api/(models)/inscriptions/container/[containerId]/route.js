import { Container, ContainerMatch } from "@/database/models";
import { CONTAINER_STATUS } from "@/helpers/helper";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const containerId = params.containerId;
  const container = await Container.findByPk(containerId);
  await container.update({
    status: CONTAINER_STATUS.PENDIENTE,
    matchDate: null,
  });
  await ContainerMatch.destroy({ where: { containerId } });
  return NextResponse.json(container);
}
