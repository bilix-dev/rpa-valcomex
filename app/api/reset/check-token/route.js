import { NextResponse } from "next/server";
import { checkResetToken } from "../../helper";

export async function GET(request) {
  const token = request.nextUrl.searchParams.get("token");
  const identifier = request.nextUrl.searchParams.get("identifier");
  const response = await checkResetToken(token, identifier);
  return NextResponse.json(response);
}
