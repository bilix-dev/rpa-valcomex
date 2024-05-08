import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initUserLogin = (sequelize, DataTypes) => {
  class UserLogin extends Model {}
  UserLogin.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "userLogin",
      underscored: true,
    }
  );
  return UserLogin;
};

export default initUserLogin(connection, DataTypes);
