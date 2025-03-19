import { DataTypes } from "sequelize";
import connection from "../connection";
import { models } from "@auth/sequelize-adapter";
import Operator from "./operator";
import Role from "./role";
import Grant from "./grant";
import UserLogin from "./user-login";
import Rpa from "./rpa";
import ServiceOrder from "./service-order";
import Container from "./container";
import ContainerEndpoint from "./container-endpoint";
import ContainerMatch from "./container-match";
import Contact from "./contact";
import Log from "./log";

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
    expires: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    dni: {
      type: DataTypes.STRING,
    },
    lastName: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
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
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        const name = this.name ?? " ";
        const lastName = this.lastName ?? " ";
        return (name + " " + lastName).trim();
      },
    },
    normalizedName: {
      type: DataTypes.VIRTUAL,
      get() {
        const name = this.name ?? " ";
        const lastName = this.lastName ?? " ";
        const first = name.trim().split(" ");
        const last = lastName.trim().split(" ");
        return (first[0] + " " + last[0])
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      },
    },
    foreign: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.country == null || this.country == "CHILE" ? false : true;
      },
    },
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
        fields: ["user_name"],
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
Rpa.beforeCreate((rpa) => (rpa.id = uuidv4()));
ServiceOrder.beforeCreate((serviceOrder) => (serviceOrder.id = uuidv4()));
Container.beforeCreate((container) => (container.id = uuidv4()));
ContainerEndpoint.beforeCreate(
  (containerEndpoint) => (containerEndpoint.id = uuidv4())
);
ContainerMatch.beforeCreate((containerMatch) => (containerMatch.id = uuidv4()));
Contact.beforeCreate((contacts) => (contacts.id = uuidv4()));
Log.beforeCreate((log) => (log.id = uuidv4()));

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

////////////////////////
//
Operator.hasMany(Rpa, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});
Rpa.belongsTo(Operator);
//
//

//
Operator.hasMany(Contact, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});
Contact.belongsTo(Operator);
//
//

Operator.hasMany(ServiceOrder, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});
ServiceOrder.belongsTo(Operator);
//
//
ServiceOrder.hasMany(Container, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});
Container.belongsTo(ServiceOrder);
//

//
Container.hasMany(ContainerEndpoint, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

ContainerEndpoint.belongsTo(Container);
//

//
Rpa.hasMany(ContainerEndpoint, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});

ContainerEndpoint.belongsTo(Rpa);
//

ContainerEndpoint.hasMany(Log, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE",
});

Log.belongsTo(ContainerEndpoint);

//
Container.hasOne(ContainerMatch, {
  foreignKey: { allowNull: false, unique: true },
  onDelete: "RESTRICT",
});

ContainerMatch.belongsTo(Container);
//

//
User.hasMany(ContainerMatch, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
});

ContainerMatch.belongsTo(User);

//

if (process.env.NODE_ENV == "development") {
  //connection.sync({ alter: true });
}

export {
  User,
  UserLogin,
  Role,
  Grant,
  RoleGrant,
  Operator,
  Rpa,
  Log,
  ServiceOrder,
  Contact,
  Container,
  ContainerEndpoint,
  ContainerMatch,
  VerificationToken,
  UserCreationToken,
  connection,
};
