import { User } from "@/database/models";
import userCreationToken from "@/database/models/user-creation-token";
import { NextResponse } from "next/server";

export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email");
  const operatorId = request.nextUrl.searchParams.get("operatorId");
  const user = await User.findOne({ where: { email } });
  const userCreation = await userCreationToken.findOne({
    where: { email, operatorId },
  });
  return NextResponse.json(!!user || !!userCreation);
}
