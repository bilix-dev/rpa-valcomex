import { User } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(request) {
  const userName = request.nextUrl.searchParams.get("userName");
  const operatorId = request.nextUrl.searchParams.get("operatorId");
  const user = await User.findOne({ where: { userName, operatorId } });
  return NextResponse.json(!!user);
}
