import { Role, RoleGrant } from "@/database/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { grants, ...data } = await request.json();
  const role = await Role.create({ ...data, super: false });

  for (let grant of grants) {
    await RoleGrant.upsert({ ...grant, roleId: role.id });
  }

  return NextResponse.json(role);
}
