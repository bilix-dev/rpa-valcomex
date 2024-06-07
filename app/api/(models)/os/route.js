import { ServiceOrder } from "@/database/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const os = await ServiceOrder.create(data);
  return NextResponse.json(os);
}
