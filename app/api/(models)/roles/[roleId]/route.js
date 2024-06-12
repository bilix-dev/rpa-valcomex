import { Role, RoleGrant } from "@/database/models";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const id = params.roleId;
  const { grants, ...data } = await request.json();
  const role = await Role.update(
    { ...data },
    { where: { id }, individualHooks: true }
  );

  for (let grant of grants) {
    await RoleGrant.upsert({ ...grant, roleId: id });
  }

  return NextResponse.json(role);
}

export async function DELETE(request, { params }) {
  const id = params.roleId;
  const role = await Role.destroy({ where: { id } });
  return NextResponse.json(role);
}
