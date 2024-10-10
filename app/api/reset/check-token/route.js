import { NextResponse } from "next/server";
import { checkResetToken } from "../../helper";
import { User, Role, Operator } from "@/database/models";

export async function GET(request) {
  const token = request.nextUrl.searchParams.get("token");
  const identifier = request.nextUrl.searchParams.get("identifier");

  const user = await User.findByPk(identifier, {
    include: [{ model: Role }, { model: Operator }],
  });

  const response = await checkResetToken(token, identifier);
  return NextResponse.json({ ...response, user });
}
