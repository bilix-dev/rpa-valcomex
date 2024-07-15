import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initOperator = (sequelize, DataTypes) => {
  class Operator extends Model {}
  Operator.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      rut: { type: DataTypes.STRING, allowNull: false },
      tariffCode: { type: DataTypes.STRING },
      expiration: DataTypes.DATE,
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
      modelName: "operator",
      underscored: true,
    }
  );
  return Operator;
};

export default initOperator(connection, DataTypes);
