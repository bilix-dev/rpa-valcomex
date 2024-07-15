import { sendDataAsync } from "@/app/api/helper";
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

export async function PUT(request, { params }) {
  const id = params.containerId;
  const container = await Container.findByPk(id, {
    include: [
      {
        model: ContainerEndpoint,
        include: { model: Rpa },
      },
      { model: ContainerMatch, include: [{ model: User }] },
      { model: ServiceOrder, include: [{ model: Operator }] },
    ],
  });
  if (container.status != CONTAINER_STATUS.ESPERA) {
    NextResponse.json(container);
  }
  for (let end of container.containerEndpoints.filter((x) => !x.status)) {
    await end.update({ error: false });
  }
  //Termina la consulta pero sigue por atras
  sendDataAsync(container);
  return NextResponse.json(container);
}
