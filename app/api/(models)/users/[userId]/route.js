import { User } from "@/database/models";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request, { params }) {
  const unscoped = request.nextUrl.searchParams.get("unscoped");
  const id = params.userId;
  const model = unscoped ? User.unscoped() : User;
  const user = await model.findByPk(id);
  return NextResponse.json(user);
}

export async function PUT(request, { params }) {
  const id = params.userId;
  const { password, confirmPassword, ...data } = await request.json();
  let payload;
  let user;
  if (password != null) {
    if (password == confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      payload = { hashedPassword };
      user = await User.update(payload, {
        where: { id },
        individualHooks: true,
      });
    } else {
      return NextResponse.json({
        message: "Ha ocurrido un error",
      });
    }
  } else {
    payload = { ...data, image: data.image ? Buffer.from(data.image) : null };
    user = await User.update(payload, { where: { id }, individualHooks: true });
  }
  return NextResponse.json(user);
}

export async function DELETE(request, { params }) {
  const id = params.userId;
  const user = await User.destroy({ where: { id } });
  return NextResponse.json(user);
}
