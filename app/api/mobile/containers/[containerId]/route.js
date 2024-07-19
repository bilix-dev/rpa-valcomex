import { headers } from "next/headers";
import { Container, ContainerMatch } from "@/database/models";
import { CONTAINER_STATUS } from "@/helpers/helper";
import { NextResponse } from "next/server";

//PREOCUPARSWWWE DE QUE LOS ESTADOS CORRESPONDAN
export async function DELETE(request, { params }) {
  const headersList = headers();
  const userName = headersList.get("userName");
  const containerId = params.containerId;
  const container = await Container.findByPk(containerId);

  if (container.status != CONTAINER_STATUS.MATCH)
    return NextResponse.json(
      { status: 1, error: "Contenedor no está en estado match" },
      { status: 400 }
    );

  await container.update({
    status: CONTAINER_STATUS.PENDIENTE,
    matchDate: null,
    updatedBy: userName,
  });
  await ContainerMatch.destroy({ where: { containerId } });
  return NextResponse.json({ status: 0 });
}

export async function PUT(request, { params }) {
  const headersList = headers();
  const userName = headersList.get("userName");
  const containerId = params.containerId;
  const container = await Container.findByPk(containerId);

  if (container.status != CONTAINER_STATUS.TRAMITADO)
    return NextResponse.json(
      { status: 1, error: "Contenedor no está en estado tramitado" },
      { status: 400 }
    );

  await container.update({
    status: CONTAINER_STATUS.FINALIZADO,
    endDate: new Date(),
    updatedBy: userName,
  });
  return NextResponse.json({ status: 0 });
}
