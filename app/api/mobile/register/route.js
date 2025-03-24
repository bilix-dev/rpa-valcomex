import { Role, User } from "@/database/models";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { addDays } from "@/helpers/helper";

export async function POST(request) {
  try {
    const { userName, email, password, confirmPassword, ...rest } =
      await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (password != confirmPassword) {
      return NextResponse.json(
        {
          status: 1,
          message: "Las contraseñas no coinciden",
        },
        { status: 400 }
      );
    }

    const existUser = await User.findOne({ where: { userName } });

    if (existUser)
      return NextResponse.json(
        {
          status: 1,
          message: "El usuario ya existe",
        },
        { status: 400 }
      );

    const existEmail = await User.findOne({ where: { email } });

    if (existEmail)
      return NextResponse.json(
        {
          status: 1,
          message: "El email ya existe",
        },
        { status: 400 }
      );

    const expiration = new Date();
    addDays(expiration, process.env.PASSWORD_EXPIRATION_DAYS_LIMIT);

    const role = await Role.findOne({ where: { name: "Chofer" } });

    if (!role)
      return NextResponse.json(
        {
          status: 1,
          message: "El rol chofer no existe",
        },
        { status: 400 }
      );

    await User.create({
      ...rest,
      userName,
      email,
      roleId: role.id,
      emailVerified: new Date(),
      hashedPassword,
      expiration,
      expires: false,
      status: true,
    });

    return NextResponse.json({
      status: 0,
      message: "Usuario creado",
      created: true,
    });
  } catch (error) {
    return NextResponse.json({ ...error, status: 1 }, { status: 500 });
  }
}

/*
name
lastName
dni
phoneNumber
country
userName
email
password
confirmPassword
*/
