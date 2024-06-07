import {
  Container,
  ContainerEndpoint,
  ContainerMatch,
  Rpa,
  ServiceOrder,
} from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const userId = params.userId;
  const containers = await Container.findAll({
    include: [
      {
        model: ServiceOrder,
      },
      {
        required: true,
        model: ContainerMatch,
        where: {
          userId,
        },
      },
      {
        required: true,
        model: ContainerEndpoint,
        include: [{ model: Rpa }],
      },
    ],
  });

  return NextResponse.json(containers);
}
