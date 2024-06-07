import { Contact } from "@/database/models";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const id = params.contactId;
  const contact = await Contact.destroy({ where: { id } });
  return NextResponse.json(contact);
}

export async function PUT(request, { params }) {
  const id = params.contactId;
  const data = await request.json();
  const contact = await Contact.update(data, {
    where: { id },
    individualHooks: true,
  });
  return NextResponse.json(contact);
}
