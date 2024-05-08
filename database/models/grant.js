import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initGrant = (sequelize, DataTypes) => {
  class Grant extends Model {}
  Grant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "grant",
      underscored: true,
    }
  );
  return Grant;
};

export default initGrant(connection, DataTypes);
