import { Operator } from "@/database/models";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request) {
  const headersList = headers();
  const operatorId = headersList.get("operatorId");
  const operator = await Operator.findByPk(operatorId);
  return NextResponse.json(operator?.appVersion);
}
