import { COUNTRY } from "@/helpers/helper";
import { NextResponse } from "next/server";

export async function GET(request) {
  const countries = Object.values(COUNTRY)
    .map((x) => x)
    .sort();
  return NextResponse.json(countries);
}
