import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { User } from "@/database/models";
import { Op } from "sequelize";

export async function GET(request, { params }) {
  const headersList = headers();
  const id = headersList.get("userId");
  const user = await User.findByPk(id);
  return user;
}

export async function PUT(request, { params }) {
  const headersList = headers();
  const userName = headersList.get("userName");
  const id = headersList.get("userId");
  const { name, lastName, email, dni, phoneNumber, country } =
    await request.json();

  const existEmail = await User.findOne({
    where: { email, id: { [Op.not]: id } },
  });

  if (existEmail)
    return NextResponse.json(
      {
        status: 1,
        message: "El email ya existe en otro usuario",
      },
      { status: 400 }
    );

  try {
    await User.update(
      { name, lastName, email, dni, phoneNumber, country, updatedBy: userName },
      {
        where: { id },
        individualHooks: true,
      }
    );
    return NextResponse.json({ status: 0 });
  } catch (e) {
    return NextResponse.json({ status: 1 }, { status: 500 });
  }
}
