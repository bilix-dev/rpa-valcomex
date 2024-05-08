import { User } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const unscoped = request.nextUrl.searchParams.get("unscoped");
  const id = params.userId;
  const model = unscoped ? User.unscoped() : User;
  const user = await model.findByPk(id);
  return NextResponse.json(user);
}

export async function PUT(request, { params }) {
  const id = params.userId;
  const data = await request.json();
  const user = await User.update(
    { ...data, image: data.image ? Buffer.from(data.image) : null },
    { where: { id } }
  );
  return NextResponse.json(user);
}

export async function DELETE(request, { params }) {
  const id = params.userId;
  const user = await User.destroy({ where: { id } });
  return NextResponse.json(user);
}
