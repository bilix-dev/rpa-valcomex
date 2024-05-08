import { User, UserCreationToken } from "@/database/models";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { checkToken } from "../helper";
import { addDays } from "@/helpers/helper";

export async function POST(request) {
  try {
    const { token, identifier, password, confirmPassword, ...rest } =
      await request.json();

    const userCreation = await UserCreationToken.findOne({
      where: { token },
    });
    const tokenCheck = checkToken(token, identifier);
    if (password != confirmPassword || !tokenCheck.valid) {
      return NextResponse.json({
        message: "Ha ocurrido un error",
        updated: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const expiration = new Date();
    addDays(expiration, process.env.PASSWORD_EXPIRATION_DAYS_LIMIT);

    await User.create({ ...rest, hashedPassword, expiration, status: true });
    await userCreation.destroy();

    return NextResponse.json({ message: "Usuario creado", updated: true });
  } catch (error) {
    return NextResponse.json({ ...error, updated: false });
  }
}
