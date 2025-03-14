import { Model, DataTypes } from "sequelize";
import connection from "../connection";
import {
  CONTAINER_STATUS,
  ENDPOINTS,
  toClLocaleString,
} from "@/helpers/helper";

const initContainer = (sequelize, DataTypes) => {
  class Container extends Model {}
  Container.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      endpoint: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: CONTAINER_STATUS.PENDIENTE,
      },
      matchDate: DataTypes.DATE,
      waitingDate: DataTypes.DATE,
      processedDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      voidDate: DataTypes.DATE,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
      //data PC
      weight: DataTypes.DOUBLE,
      clientRut: DataTypes.STRING,
      dispatcher: DataTypes.STRING,
      //data STI
      vgmWeight: DataTypes.DOUBLE,
      operation: DataTypes.STRING,
      shippingCompany: DataTypes.STRING,
      businessName: DataTypes.STRING,

      //data SILOGPORT
      containerType: DataTypes.STRING,
      ship: DataTypes.STRING,

      //data TPS
      vgmWeightVerifier: DataTypes.STRING,
      weightChargeOnly: DataTypes.DOUBLE,
      numCartaPorte: DataTypes.STRING,
      consignee: DataTypes.STRING,
      mobileStatus: {
        type: DataTypes.VIRTUAL,
      },
      endpointMap: {
        type: DataTypes.VIRTUAL,
      },
      // currentStateDateClFormat: {
      //   type: DataTypes.VIRTUAL,
      // },
    },
    {
      sequelize,
      modelName: "container",
      underscored: true,
      getterMethods: {
        endpointMap: function () {
          return ENDPOINTS[this.endpoint];
        },
        mobileStatus: function () {
          switch (this.status) {
            case CONTAINER_STATUS.ANULADO:
              return -1;
            case CONTAINER_STATUS.VISADO:
              return 1;
            case CONTAINER_STATUS.FINALIZADO:
              return 2;
            default:
              return 0;
          }
        },
      },
      //   currentStateDateClFormat: function () {
      //     return toClLocaleString(this.currentStateDate);
      //   },
      // },
    }
  );
  return Container;
};

export default initContainer(connection, DataTypes);
