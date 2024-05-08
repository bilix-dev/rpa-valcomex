import { DataTypes } from "sequelize";
import connection from "../connection";
import { models } from "@auth/sequelize-adapter";
import Operator from "./operator";
import Role from "./role";
import Grant from "./grant";
import UserLogin from "./user-login";
import { v4 as uuidv4 } from "uuid";
import UserCreationToken from "./user-creation-token";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

//MODELOS
var User = connection.define(
  "user",
  {
    ...models.User,
    image: {
      type: DataTypes.BLOB("medium"),
    },
    userName: { type: DataTypes.STRING, allowNull: false },
    hashedPassword: {
      type: DataTypes.STRING,
    },
    expiration: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
  },

  {
    defaultScope: {
      attributes: {
        exclude: ["image"],
      },
    },
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_name", "operator_id"],
      },
    ],
  }
);

var VerificationToken = connection.define(
  "verification_token",
  {
    ...models.VerificationToken,
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    underscored: true,
  }
);

var RoleGrant = connection.define(
  "role_grant",
  {
    view: DataTypes.BOOLEAN,
    edit: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN,
  },
  { underscored: true }
);

connection.addHook("beforeCreate", async (e) => {
  const session = await getServerSession(authOptions);

  if ("createdBy" in e) {
    e.createdBy = session?.user?.userName;
  }

  if ("updatedBy" in e) {
    e.updatedBy = session?.user?.userName;
  }
});

connection.addHook("beforeUpdate", async (e) => {
  const session = await getServerSession(authOptions);
  if ("updatedBy" in e) {
    e.updatedBy = session?.user?.userName;
  }
});

//IDs
connection.models.user.beforeCreate((user) => (user.id = uuidv4()));
Role.beforeCreate((role) => (role.id = uuidv4()));
Grant.beforeCreate((grant) => (grant.id = uuidv4()));
UserLogin.beforeCreate((userLogin) => (userLogin.id = uuidv4()));

//Asociaciones
Operator.hasMany(Role, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});
Role.belongsTo(Operator);

Role.belongsToMany(Grant, {
  through: connection.models.role_grant,
});
Grant.belongsToMany(Role, {
  through: connection.models.role_grant,
});

//
connection.models.user.hasMany(UserLogin, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});

UserLogin.belongsTo(connection.models.user);

//
Role.hasMany(connection.models.user, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});

connection.models.user.belongsTo(Role);
//

//
Operator.hasMany(connection.models.user, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});
connection.models.user.belongsTo(Operator);
//

//
Operator.hasMany(UserCreationToken, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

UserCreationToken.belongsTo(Operator);
//

//
Role.hasMany(UserCreationToken, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});
UserCreationToken.belongsTo(Role);
//

if (process.env.NODE_ENV == "development") {
  connection.sync({ alter: true });
}

export {
  User,
  UserLogin,
  Role,
  Grant,
  RoleGrant,
  Operator,
  VerificationToken,
  UserCreationToken,
  connection,
};
