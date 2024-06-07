import { Model, DataTypes } from "sequelize";
import connection from "../connection";

const initContact = (sequelize, DataTypes) => {
  class Contact extends Model {}
  Contact.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "contact",
      underscored: true,
    }
  );
  return Contact;
};

export default initContact(connection, DataTypes);
