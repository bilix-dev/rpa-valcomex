import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initUserCreationToken = (sequelize, DataTypes) => {
  class UserCreationToken extends Model {}
  UserCreationToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      token: DataTypes.STRING,
      expires: DataTypes.DATE,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "userCreationToken",
      underscored: true,
    }
  );
  return UserCreationToken;
};

export default initUserCreationToken(connection, DataTypes);
