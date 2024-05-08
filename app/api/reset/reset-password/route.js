import { NextResponse } from "next/server";
import { User, VerificationToken } from "@/database/models";
import { checkResetToken } from "../../helper";
import bcrypt from "bcrypt";
import { addDays } from "@/helpers/helper";

export async function POST(request) {
  const { token, identifier, password, confirmPassword } = await request.json();
  const response = await checkResetToken(token, identifier);

  //Si el checkeo es correcto y el password es igual, modificar contraseña
  if (response.valid && password == confirmPassword) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const expiration = new Date();
    addDays(expiration, process.env.PASSWORD_EXPIRATION_DAYS_LIMIT);

    await User.update(
      { hashedPassword, expiration },
      { where: { id: identifier } }
    );
    //Borro el token de la BD para que sea invalidado
    await VerificationToken.destroy({
      where: { token },
    });

    return NextResponse.json({
      message: "Contraseña actualizada",
      updated: true,
    });
  }
  return NextResponse.json({ message: "Ha ocurrido un error", updated: false });
}

export async function PUT(request) {
  const { userId, oldPassword, password, confirmPassword } =
    await request.json();
  // modificar contraseña
  if (password == confirmPassword) {
    const user = await User.findByPk(userId);
    const samePassword = await bcrypt.compare(oldPassword, user.hashedPassword);

    if (samePassword) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiration = new Date();
      addDays(expiration, process.env.PASSWORD_EXPIRATION_DAYS_LIMIT);
      await User.update(
        { hashedPassword, expiration },
        { where: { id: userId } }
      );
      return NextResponse.json({
        message: "Contraseña actualizada",
        updated: true,
      });
    }
  }
  return NextResponse.json({ message: "Ha ocurrido un error", updated: false });
}
