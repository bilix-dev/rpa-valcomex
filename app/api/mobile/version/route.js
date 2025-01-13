import { Operator } from "@/database/models";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request) {
  const headersList = headers();
  const operatorId = headersList.get("operatorId");
  const operator = await Operator.findByPk(operatorId);
  return NextResponse.json({ appVersion: operator?.appVersion });
}

export async function PUT(request) {
  const headersList = headers();
  const operatorId = headersList.get("operatorId");
  const { appVersion } = await request.json();
  const operator = await Operator.findByPk(operatorId);
  const result = await operator.update({ appVersion });
  return NextResponse.json({ appVersion: result?.appVersion });
}
