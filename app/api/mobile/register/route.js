import { User } from "@/database/models";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { addDays } from "@/helpers/helper";

export async function POST(request) {
  try {
    const { userName, email, password, confirmPassword, ...rest } =
      await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (password != confirmPassword) {
      return NextResponse.json({
        message: "Las contraseñas no coinciden",
        created: false,
      });
    }

    const existUser = await User.findOne({ where: { userName } });

    if (existUser)
      return NextResponse.json({
        message: "El usuario ya existe",
        created: false,
      });

    const existEmail = await User.findOne({ where: { email } });

    if (existEmail)
      return NextResponse.json({
        message: "El email ya existe",
        created: false,
      });

    const expiration = new Date();
    addDays(expiration, process.env.PASSWORD_EXPIRATION_DAYS_LIMIT);

    await User.create({
      ...rest,
      userName,
      email,
      emailVerified: new Date(),
      hashedPassword,
      expiration,
      expires: false,
      status: true,
    });

    return NextResponse.json({ message: "Usuario creado", created: true });
  } catch (error) {
    return NextResponse.json({ ...error, created: false }, { status: 500 });
  }
}

/*
name
dni
phoneNumber
country
userName
email
password
confirmPassword
*/
