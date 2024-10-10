import { sendUserCreationMail } from "@/app/api/helper";
import { UserCreationToken } from "@/database/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const userVerification = await UserCreationToken.create({ ...data });
  const token = await sendUserCreationMail(request, userVerification);
  const result = await userVerification.update({
    token: token.token,
    expires: token.expires,
  });

  return NextResponse.json(result);
}
