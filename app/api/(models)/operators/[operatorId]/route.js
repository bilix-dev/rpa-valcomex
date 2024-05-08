import { Operator } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const unscoped = request.nextUrl.searchParams.get("unscoped");
  const id = params.operatorId;
  const model = unscoped ? Operator.unscoped() : Operator;
  const operator = await model.findByPk(id);
  return NextResponse.json(operator);
}

export async function PUT(request, { params }) {
  const id = params.operatorId;
  const data = await request.json();
  const operator = await Operator.update(data, { where: { id } });
  return NextResponse.json(operator);
}
