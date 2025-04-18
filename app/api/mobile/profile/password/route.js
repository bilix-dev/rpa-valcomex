import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { User } from "@/database/models";
import bcrypt from "bcrypt";

export async function PUT(request, { params }) {
  const headersList = headers();
  const userName = headersList.get("userName");
  const id = headersList.get("userId");
  const { password, confirmPassword, oldPassword } = await request.json();
  try {
    const existUser = await User.findOne({
      where: { id },
    });

    if (!existUser)
      return NextResponse.json(
        {
          status: 1,
          message: "El usuario no existe",
        },
        { status: 400 }
      );

    const compare = await bcrypt.compare(oldPassword, existUser.hashedPassword);

    if (!compare)
      return NextResponse.json(
        {
          status: 1,
          message: "La antigua password no coincide",
        },
        { status: 400 }
      );

    if (password != confirmPassword) {
      return NextResponse.json(
        {
          status: 1,
          message: "Las password no coinciden",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await existUser.update({ hashedPassword, updatedBy: userName });
    return NextResponse.json({ status: 0 });
  } catch (e) {
    return NextResponse.json(
      { status: 1, message: e.message },
      { status: 500 }
    );
  }
}
