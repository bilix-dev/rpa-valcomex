import { sendUserCreationMail } from "@/app/api/helper";
import { UserCreationToken } from "@/database/models";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const id = params.userCreationId;
  const userVerification = await UserCreationToken.destroy({ where: { id } });
  return NextResponse.json(userVerification);
}

export async function PUT(request, { params }) {
  const id = params.userCreationId;
  const userVerification = await UserCreationToken.findByPk(id);
  const token = await sendUserCreationMail(request, userVerification);
  await userVerification.update({
    token: token.token,
    expires: token.expires,
  });
  return NextResponse.json(result);
}
