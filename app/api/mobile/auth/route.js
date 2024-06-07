import { headers } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Operator, Role, RoleGrant, User } from "@/database/models";
import { generateToken } from "../../helper";

export async function POST(request) {
  const headersList = headers();
  const authorization = headersList.get("authorization");

  if (authorization == null)
    return NextResponse.json(
      { error: "credenciales incorrectas" },
      { status: 401 }
    );

  const userCredentials = Buffer.from(authorization.split(" ")[1], "base64")
    .toString()
    .split(":");

  const user = await User.findOne({
    where: {
      userName: userCredentials[0],
    },
    include: [
      {
        model: Operator,
      },
      {
        model: Role,
      },
    ],
  });

  if (user == null) {
    return NextResponse.json(
      { error: "credenciales incorrectas" },
      { status: 401 }
    );
  }

  if (user.role.mobile == false) {
    return NextResponse.json(
      { error: "Sin permiso para usar app movil" },
      { status: 401 }
    );
  }

  const compare = await bcrypt.compare(userCredentials[1], user.hashedPassword);

  if (!compare) {
    return NextResponse.json(
      { error: "credenciales incorrectas" },
      { status: 401 }
    );
  }
  const token = generateToken(
    {
      userId: user.id,
      roleId: user.roleId,
      operatorId: user.operatorId,
      userName: user.userName,
      name: user.name,
      role: user.role.name,
    },
    process.env.USER_SESSION_MINUTES_LIMIT * 60
  );
  return NextResponse.json(token);
}
