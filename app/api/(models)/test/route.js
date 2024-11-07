import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const response = await fetch(
    "http://qa.puertocolumbo.com:8090/XPS/rest/facturas/tramitadas?limit=100&tipo=33"
  );
  const data = await response.json();

  return NextResponse.json(data);
}
