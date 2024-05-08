import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initRole = (sequelize, DataTypes) => {
  class Role extends Model {}
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      super: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "roles",
      underscored: true,
    }
  );
  return Role;
};

export default initRole(connection, DataTypes);
