import { User } from "@/database/models";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function GET(request, { params }) {
  const id = params.userId;
  const search = request.nextUrl.searchParams.get("search");
  const user = await User.findOne({
    where: { userName: search, id: { [Op.ne]: id } },
  });
  return NextResponse.json(user == null);
}
