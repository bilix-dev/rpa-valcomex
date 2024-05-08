import { NextResponse } from "next/server";
import { checkToken } from "../../helper";
import { Operator, Role, UserCreationToken } from "@/database/models";
import { Sequelize } from "sequelize";

export async function GET(request) {
  const token = request.nextUrl.searchParams.get("token");
  const identifier = request.nextUrl.searchParams.get("identifier");

  const userCreationToken = await UserCreationToken.findOne({
    attributes: {
      include: [
        [
          Sequelize.literal(`(
        SELECT IF(COUNT(*) > 0, 1, 0)
        FROM users AS u
        WHERE
            u.email = userCreationToken.email 
    )`),
          "inUse",
        ],
      ],
    },
    where: { token },
    include: [{ model: Role }, { model: Operator }],
  });
  const status = checkToken(userCreationToken?.token, identifier);

  return NextResponse.json({ data: userCreationToken, status });
}
