import { Operator, Rpa, connection } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.operatorId;
  const operator = await Operator.findByPk(id);
  return NextResponse.json(operator);
}

export async function PUT(request, { params }) {
  const id = params.operatorId;
  const { rpas, ...data } = await request.json();
  const t = await connection.transaction();
  try {
    const operator = await Operator.update(data, {
      where: { id },
      individualHooks: true,
      transaction: t,
    });

    for (const rpa of rpas) {
      await Rpa.update(rpa, {
        where: { id: rpa.id },
        individualHooks: true,
        transaction: t,
      });
    }
    await t.commit();
    return NextResponse.json(operator);
  } catch (e) {
    await t.rollback();
    return NextResponse.json(e, { status: 500 });
  }
}
