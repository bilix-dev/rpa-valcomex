import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initContainerEndpoint = (sequelize, DataTypes) => {
  class ContainerEndpoint extends Model {}
  ContainerEndpoint.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      status: { type: DataTypes.BOOLEAN, defaultValue: false },
      error: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "containerEndpoint",
      underscored: true,
    }
  );
  return ContainerEndpoint;
};

export default initContainerEndpoint(connection, DataTypes);
