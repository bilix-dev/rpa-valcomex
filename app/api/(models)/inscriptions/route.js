import { sendEmail } from "@/configs/email";
import {
  Contact,
  Container,
  ContainerMatch,
  ServiceOrder,
  User,
  connection,
} from "@/database/models";
import MatchMail from "@/emails/MatchMail";
import { CONTAINER_STATUS } from "@/helpers/helper";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const t = await connection.transaction();
  try {
    await Container.update(
      { status: CONTAINER_STATUS.MATCH, matchDate: new Date() },
      { where: { id: data.containerId }, transaction: t, individualHooks: true }
    );
    await ContainerMatch.create(data, { transaction: t });

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
    return NextResponse.json({ status: 1 }, { status: 400 });
  }
}
