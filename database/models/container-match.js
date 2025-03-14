import { Model, DataTypes } from "sequelize";
import connection from "../connection";

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
      plateNumberCountry: { type: DataTypes.STRING },
      containerId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
      micdta: { type: DataTypes.STRING },
      seal: { type: DataTypes.STRING },
      sealLine: { type: DataTypes.STRING },
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
