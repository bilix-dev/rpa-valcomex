import { User } from "@/database/models";
import userCreationToken from "@/database/models/user-creation-token";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email");
  const operatorId = request.nextUrl.searchParams.get("operatorId");
  const user = await User.findOne({ where: { email } });
  const userCreation = await userCreationToken.findOne({
    where: { email, operatorId },
  });
  return NextResponse.json(!!user || !!userCreation);
}

export async function POST(request, { params }) {
  const { password, confirmPassword, ...data } = await request.json();

  if (password != confirmPassword) {
    return NextResponse.json({
      message: "Ha ocurrido un error",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create(
    { ...data, hashedPassword, status: true },
    { individualHooks: true }
  );
  return NextResponse.json(user);
}
