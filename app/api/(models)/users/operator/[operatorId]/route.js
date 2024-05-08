import { User, Role } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const operatorId = params.operatorId;
  const users = await User.unscoped().findAll({
    where: { operatorId },
    include: [{ model: Role }],
  });
  return NextResponse.json(users);
}
