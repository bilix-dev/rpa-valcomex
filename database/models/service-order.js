import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initServiceOrder = (sequelize, DataTypes) => {
  class ServiceOrder extends Model {}
  ServiceOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: { type: DataTypes.STRING, allowNull: false },
      booking: { type: DataTypes.STRING, allowNull: false },
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "serviceOrder",
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["code"],
        },
      ],
    }
  );
  return ServiceOrder;
};

export default initServiceOrder(connection, DataTypes);
