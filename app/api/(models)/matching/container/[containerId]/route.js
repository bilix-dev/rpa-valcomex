import { sendDataAsync } from "@/app/api/helper";
import { Container, ContainerEndpoint, Rpa } from "@/database/models";
import { CONTAINER_STATUS } from "@/helpers/helper";
import useRemoteAxios from "@/hooks/useRemoteAxios";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function PUT(request, { params }) {
  const id = params.containerId;
  const container = await Container.findByPk(id, {
    include: {
      model: ContainerEndpoint,
      include: { model: Rpa },
    },
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
