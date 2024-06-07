import {
  Container,
  ContainerEndpoint,
  Rpa,
  ServiceOrder,
} from "@/database/models";
import { NextResponse } from "next/server";
import qs from "qs";
import { Op } from "sequelize";

export async function GET(request, { params }) {
  const operatorId = params.operatorId;
  const query = qs.parse(request.nextUrl.search, { ignoreQueryPrefix: true });
  const search = query.search;
  const pageSize = parseInt(query.pageSize);

  const containers = await Container.findAll({
    include: [
      { model: ServiceOrder, where: { operatorId }, required: true },
      { model: ContainerEndpoint, include: [{ model: Rpa }] },
    ],
    where: {
      [Op.or]: {
        name: { [Op.like]: "%" + search + "%" },
        "$serviceOrder.code$": { [Op.like]: "%" + search + "%" },
      },
    },
    order: [["created_at", "DESC"]],
    limit: pageSize,
  });

  return NextResponse.json(containers);
}
