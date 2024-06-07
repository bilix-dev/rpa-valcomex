import { Container, ServiceOrder } from "@/database/models";
import { NextResponse } from "next/server";
import qs from "qs";
import { paramsOs } from "@/app/api/helper";

export async function GET(request, { params }) {
  const operatorId = params.operatorId;
  const query = qs.parse(request.nextUrl.search, { ignoreQueryPrefix: true });
  const { sortBy, pageIndex, pageSize, filters } = paramsOs(query);
  filters.operatorId = operatorId;
  const oss = await ServiceOrder.findAndCountAll({
    include: [
      {
        model: Container,
      },
    ],
    distinct: true,
    order: sortBy,
    offset: pageIndex * pageSize,
    limit: pageSize,
    where: filters,
  });

  return NextResponse.json(oss);
}
