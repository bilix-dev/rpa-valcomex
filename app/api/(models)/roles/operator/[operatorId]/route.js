import { Role, Grant, User } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const operatorId = params.operatorId;
  const roles = await Role.findAll({
    where: { operatorId },
    include: [{ model: User }, { model: Grant }],
  });
  return NextResponse.json(roles);
}
