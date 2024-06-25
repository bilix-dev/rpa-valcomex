import { User } from "@/database/models";
import { NextResponse } from "next/server";
import { generateResetToken } from "../../helper";
import { sendEmail } from "@/configs/email";
import ResetPasswordMail from "@/emails/ResetPasswordMail";
import { render } from "@react-email/components";

export async function POST(request) {
  const { email } = await request.json();
  var user = await User.findOne({
    where: { email },
  });
  if (user == null)
    return NextResponse.json({
      message: "Accion realizada",
    });
  const token = await generateResetToken(user.id);
  const url = `${process.env.NEXTAUTH_URL}/reset-password/${token.identifier}/${token.token}`;

  await sendEmail({
    to: user.email,
    subject: "Solicitud de cambio de contraseña",
    html: render(
      ResetPasswordMail({
        userFirstname: user.name,
        resetPasswordLink: url,
      })
    ),
  });

  return NextResponse.json({
    message: "Accion realizada",
  });
}
