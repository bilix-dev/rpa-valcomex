import {
  Container,
  ContainerEndpoint,
  ContainerMatch,
  Rpa,
  ServiceOrder,
  User,
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
        include: [{ model: User }],
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
    order: [["matchDate", "DESC"]],
  });

  return NextResponse.json(containers);
}
