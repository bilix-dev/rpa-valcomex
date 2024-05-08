import { Operator } from "@/database/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name } = await request.json();
  const operator = await Operator.create({ name });
  return NextResponse.json(operator);
}
