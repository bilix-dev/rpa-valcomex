import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendEmail } from "@/configs/email";
import {
  Contact,
  Container,
  ContainerEndpoint,
  ContainerMatch,
  ServiceOrder,
  Rpa,
  User,
  connection,
} from "@/database/models";
import MatchMail from "@/emails/MatchMail";
import { render } from "@react-email/components";
import { CONTAINER_STATUS } from "@/helpers/helper";

export async function GET(request) {
  const headersList = headers();
  const userId = headersList.get("userId");

  const containers = await Container.findAll({
    include: [
      {
        model: ServiceOrder,
      },
      {
        required: true,
        model: ContainerMatch,
        where: {
          userId,
        },
      },
      {
        required: true,
        model: ContainerEndpoint,
        include: [{ model: Rpa }],
      },
    ],
    order: [["matchDate", "DESC"]],
  });

  return NextResponse.json(containers);
}

//VALIDACION
export async function POST(request) {
  const headersList = headers();
  const userName = headersList.get("userName");
  const userId = headersList.get("userId");

  const data = await request.json();
  const t = await connection.transaction();
  try {
    const container = await Container.findByPk(data.containerId, {
      transaction: t,
    });

    if (container.status != CONTAINER_STATUS.PENDIENTE) {
      await t.rollback();
      return NextResponse.json(
        { status: 1, error: "Contenedor no está en estado pendiente" },
        { status: 400 }
      );
    }
    await Container.update(
      {
        status: CONTAINER_STATUS.MATCH,
        matchDate: new Date(),
        updatedBy: userName,
      },
      {
        where: { id: data.containerId },
        transaction: t,
        individualHooks: true,
      }
    );
    await ContainerMatch.create(
      { ...data, userId: userId, createdBy: userName },
      { transaction: t }
    );

    //Enviar correo correspondiente
    const to = await Contact.findAll({
      where: {
        status: true,
      },
    });

    if (to.length > 0) {
      const fc = await Container.findByPk(data.containerId, {
        include: [
          { model: ServiceOrder },
          { model: ContainerMatch, include: [{ model: User }] },
        ],
        transaction: t,
      });
      sendEmail({
        to: to.map((x) => x.email),
        subject: "Nueva inscripción",
        html: render(MatchMail({ data: fc })),
      });
    }

    await t.commit();
    return NextResponse.json({ status: 0 });
  } catch (e) {
    await t.rollback();
    return NextResponse.json({ status: 1, error: e?.message }, { status: 400 });
  }
}
