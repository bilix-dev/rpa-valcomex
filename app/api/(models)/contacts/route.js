import { Contact } from "@/database/models";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const contact = await Contact.create(data);
  return NextResponse.json(contact);
}
