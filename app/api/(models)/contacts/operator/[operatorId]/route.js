import { Contact } from "@/database/models";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
  const operatorId = params.operatorId;
  const contacts = await Contact.findAll({ where: { operatorId } });
  return NextResponse.json(contacts);
}
