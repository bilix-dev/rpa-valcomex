import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initLog = (sequelize, DataTypes) => {
  class Log extends Model {}
  Log.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: { type: DataTypes.INTEGER },
      message: { type: DataTypes.STRING },
      cause: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "log",
      underscored: true,
    }
  );
  return Log;
};

export default initLog(connection, DataTypes);
