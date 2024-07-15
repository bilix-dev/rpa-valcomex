import { COUNTRY } from "@/helpers/helper";
import { NextResponse } from "next/server";

export async function GET(request) {
  const countries = Object.values(COUNTRY).map((x) => x);
  return NextResponse.json(countries);
}
