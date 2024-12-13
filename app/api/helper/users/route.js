import { User } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const search = request.nextUrl.searchParams.get("search");
  const user = await User.findOne({
    where: { userName: search },
  });
  return NextResponse.json(user == null);
}
