import {
  Container,
  ContainerEndpoint,
  ContainerMatch,
  Rpa,
  ServiceOrder,
  User,
} from "@/database/models";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const id = params.osId;
  const os = await ServiceOrder.destroy({ where: { id } });
  return NextResponse.json(os);
}

export async function PUT(request, { params }) {
  const id = params.osId;
  const data = await request.json();
  const os = await ServiceOrder.update(data, {
    where: { id },
    individualHooks: true,
  });
  return NextResponse.json(os);
}

export async function GET(request, { params }) {
  const osId = params.osId;
  const os = await ServiceOrder.findByPk(osId, {
    include: [
      {
        model: Container,
        include: [
          { model: ContainerEndpoint, include: [{ model: Rpa }] },
          { model: ContainerMatch, include: [{ model: User }] },
        ],
      },
    ],
  });

  return NextResponse.json(os);
}
