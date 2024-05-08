import { UserCreationToken, Role } from "@/database/models";
import { NextResponse } from "next/server";
import { Sequelize } from "sequelize";

export async function GET(req, { params }) {
  const operatorId = params.operatorId;
  const userVerifications = await UserCreationToken.findAll({
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
    where: { operatorId },
    include: [{ model: Role }],
  });

  return NextResponse.json(userVerifications);
}
