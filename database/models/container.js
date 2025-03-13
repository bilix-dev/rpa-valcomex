import { Model, DataTypes } from "sequelize";
import connection from "../connection";
import { CONTAINER_STATUS, toClLocaleString } from "@/helpers/helper";

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
      currentStateDate: {
        type: DataTypes.VIRTUAL,
      },
      currentStateDateClFormat: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      sequelize,
      modelName: "container",
      underscored: true,
      getterMethods: {
        currentStateDate: function () {
          switch (this.status) {
            case CONTAINER_STATUS.PENDIENTE:
              return this.createdAt;
            case CONTAINER_STATUS.MATCH:
              return this.matchDate;
            case CONTAINER_STATUS.ESPERA:
              return this.waitingDate;
            case CONTAINER_STATUS.TRAMITADO:
              return this.processedDate;
            case CONTAINER_STATUS.FINALIZADO:
              return this.endDate;
            case CONTAINER_STATUS.VOID:
              return this.voidDate;
            default:
              return this.createdAt;
          }
        },
        currentStateDateClFormat: function () {
          return toClLocaleString(this.currentStateDate);
        },
      },
    }
  );
  return Container;
};

export default initContainer(connection, DataTypes);

// <div className="flex flex-row items-center">
//       <IconBar
//         type={CONTAINER_STATUS.PENDIENTE}
//         current={status}
//         next={next}
//         date={data.createdAt}
//       />
//       <IconBar
//         type={CONTAINER_STATUS.MATCH}
//         current={status}
//         next={next}
//         date={data.matchDate}
//       />
//       <IconBar
//         type={CONTAINER_STATUS.ESPERA}
//         current={status}
//         next={next}
//         date={data.waitingDate}
//       />
//       <IconBar
//         type={CONTAINER_STATUS.TRAMITADO}
//         current={status}
//         next={next}
//         date={data.processedDate}
//       />
//       <IconBar
//         type={CONTAINER_STATUS.FINALIZADO}
//         current={status}
//         next={next}
//         date={data.endDate}
//       />
//     </div>
