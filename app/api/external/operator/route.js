import {
  Operator,
  Role,
  User,
  UserCreationToken,
  connection,
} from "@/database/models";
import { NextResponse } from "next/server";
import { Op, Sequelize } from "sequelize";
import { sendUserCreationMail } from "../../helper";
import QueryString from "qs";

export async function GET(request) {
  try {
    const query = QueryString.parse(request.nextUrl.search, {
      ignoreQueryPrefix: true,
    });

    const status = query.status?.toLowerCase();
    const name = query.name;
    const clientNumber = query.clientNumber;

    const filters = [];

    if (name)
      filters.push({
        name: { [Op.like]: "%" + name + "%" },
      });

    if (clientNumber)
      filters.push({ client_number: { [Op.like]: "%" + clientNumber + "%" } });

    const companies = JSON.stringify(
      await Operator.findAll({
        where: filters,
        include: [
          {
            model: Role,
            where: { name: "Administrador", super: true },
            include: [
              { model: User },
              {
                attributes: {
                  include: [
                    [
                      Sequelize.literal(`(
              SELECT IF(COUNT(*) > 0, 1, 0)
              FROM users AS u
              WHERE
                  u.email = \`roles->userCreationTokens\`.\`email\`
          )`),
                      "inUse",
                    ],
                  ],
                },
                model: UserCreationToken,
              },
            ],
          },
        ],
      })
    );

    const data = JSON.parse(companies);

    const result = data.map(({ roles, ...rest }) => {
      const { users, userCreationTokens } = roles?.[0];
      let user = null;
      if (users?.length > 0) {
        user = {
          id: users[0].id,
          email: users[0].email,
          expires: null,
          role: "Administrador",
          status: "Válido",
        };
      } else if (userCreationTokens?.length > 0) {
        let status = !Boolean(userCreationTokens[0].inUse)
          ? new Date() < new Date(userCreationTokens[0].expires)
            ? "Pendiente"
            : "Vencido"
          : "Inválido";
        user = {
          id: userCreationTokens[0].id,
          email: userCreationTokens[0].email,
          expires: userCreationTokens[0].expires,
          role: "Administrador",
          status,
        };
      }
      return { ...rest, user };
    });

    const filtered = result.filter((x) => {
      if (
        name != null &&
        clientNumber != null &&
        status &&
        status != "todos" &&
        status != x.user?.status.toLowerCase()
      )
        return false;
      return true;
    });

    return NextResponse.json({
      status: 0,
      message: "OK",
      data: filtered,
    });
  } catch (error) {
    return NextResponse.json({
      status: 1,
      message: error?.message,
    });
  }
}

export async function POST(request) {
  const t = await connection.transaction();
  try {
    const { operator, user } = await request.json();

    //Comprobar si existe la operador
    if (operator?.rut == null) throw new Error("Rut de operador no definido");

    //Comprobar si existe usuario
    if (user?.email == null) throw new Error("Email no definido");

    const foundOperator = await Operator.findOne({
      where: { rut: operator.rut },
    });

    if (foundOperator != null)
      throw new Error("Ya existe un operador asociado a ese rut");

    const newOperator = await Operator.create(
      { ...operator, status: true },
      { transaction: t }
    );

    const newRole = await Role.create(
      {
        name: "Administrador",
        super: true,
        operatorId: newOperator.id,
      },
      { transaction: t }
    );

    //Checkear si el usuario ya existe
    const foundUser = await User.findOne({ where: { email: user.email } });

    if (foundUser != null)
      throw new Error("El usuario ya existe en el sistema");

    //Generar una solicitud de creacion de usuario
    const userVerification = await UserCreationToken.create(
      {
        email: user.email,
        roleId: newRole.id,
        operatorId: newOperator.id,
      },
      { transaction: t }
    );
    const token = await sendUserCreationMail(request, userVerification);

    await userVerification.update(
      {
        token: token.token,
        expires: token.expires,
      },
      { transaction: t }
    );

    await t.commit();
    return NextResponse.json({
      status: 0,
      message: "Operador creada correctamente",
      data: { operator: operator, user: userVerification },
    });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ status: 1, message: error?.message });
  }
}
