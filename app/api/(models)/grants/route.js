import { Grant } from "@/database/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { code, name, type } = await request.json();
  const grant = await Grant.create({ code, name, type });
  return NextResponse.json(grant);
}

export async function GET(request) {
  const grant = await Grant.findAll({
    order: [
      ["type", "ASC"],
      ["name", "ASC"],
    ],
  });
  return NextResponse.json(grant);
}
