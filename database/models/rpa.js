import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initRpa = (sequelize, DataTypes) => {
  class Rpa extends Model {}
  Rpa.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false },
      userName: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "rpa",
      underscored: true,
    }
  );
  return Rpa;
};

export default initRpa(connection, DataTypes);
