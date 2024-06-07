import { Model, DataTypes } from "sequelize";
import connection from "../connection";
import { CONTAINER_STATUS } from "@/helpers/helper";

const initContainerMatch = (sequelize, DataTypes) => {
  class ContainerMatch extends Model {}
  ContainerMatch.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      plateNumber: { type: DataTypes.STRING, allowNull: false },
      containerId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "containerMatch",
      underscored: true,
    }
  );
  return ContainerMatch;
};

export default initContainerMatch(connection, DataTypes);
