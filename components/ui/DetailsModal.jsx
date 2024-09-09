import {
  CONTAINER_STATUS,
  ENDPOINTS,
  ENDPOINTS_KEYS,
  toFormatContainer,
  toFormatDateTime,
} from "@/helpers/helper";
import React, { useState } from "react";
import CellStatus from "./CellStatus";
import { formatRut } from "rutlib";
import Modal from "./Modal";
import StatusBar from "./StatusBar";
const DetailsModal = ({ OpenButtonComponent, title, data = {} }) => {
  const [open, isOpen] = useState(false);

  let status = data.status;
  const isAnyError = data.containerEndpoints.some((x) => x.error);
  if (isAnyError) {
    status = CONTAINER_STATUS.ERROR;
  }

  return (
    <>
      <OpenButtonComponent
        onClick={() => {
          isOpen(true);
        }}
      />
      <Modal
        activeModal={open}
        onClose={() => isOpen(false)}
        title={title}
        labelClass="btn-outline-dark"
        uncontrol={false}
        className="max-w-3xl"
      >
        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm">
          <div className="flex justify-between items-center">
            <div className="capitalize font-semibold">OS</div>
            <span>{data.serviceOrder.code}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="capitalize font-semibold">Booking</div>
            <span>{data.serviceOrder.booking}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="capitalize font-semibold">Contenedor</div>
            <span>{toFormatContainer(data.name)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="capitalize font-semibold">Creación</div>
            <span>{toFormatDateTime(data.createdAt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="capitalize font-semibold">Destino</div>
            <span>{ENDPOINTS[data.endpoint]}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="capitalize font-semibold">Estado</div>
            <CellStatus text={status} />
          </div>
          <div className="flex justify-between items-center">
            <div className="capitalize font-semibold">Flujo</div>
            <StatusBar data={data} />
          </div>
        </div>
        {ENDPOINTS_KEYS.silogport_tps == data.endpoint && (
          <>
            <hr />
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm mt-3">
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Tipo Contenedor</div>
                <span>{data.containerType}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Nave</div>
                <span>{data.ship}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">
                  Nº de Carta de Corte
                </div>
                <span>{data.numCartaPorte}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">ISO Code</div>
                <span>{data.isoCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Consignatario</div>
                <span>{data.consignee}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Peso VGM</div>
                <span>{data.vgmWeight}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">
                  Peso VGM Verifier
                </div>
                <span>{data.vgmWeightVerifier}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">
                  Peso (Solo Carga)
                </div>
                <span>{data.weightChargeOnly}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Rut</div>
                <span>{data.clientRut ? formatRut(data.clientRut) : null}</span>
              </div>
            </div>
          </>
        )}
        {ENDPOINTS_KEYS.pc == data.endpoint && (
          <>
            <hr />
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm mt-3">
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Peso</div>
                <span>{data.weight}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Rut Cliente</div>
                <span>{data.clientRut ? formatRut(data.clientRut) : null}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Transportista</div>
                <span>{data.dispatcher}</span>
              </div>
            </div>
          </>
        )}
        {ENDPOINTS_KEYS.sti == data.endpoint && (
          <>
            <hr />
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm mt-3">
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Operación</div>
                <span>{data.operation}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Código Naviera</div>
                <span>{data.shippingCompany}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Peso</div>
                <span>{data.weight}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Peso VGM</div>
                <span>{data.vgmWeight}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Razon Social</div>
                <span>{data.businessName}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Rut Cliente</div>
                <span>{data.clientRut ? formatRut(data.clientRut) : null}</span>
              </div>
            </div>
          </>
        )}
        {(ENDPOINTS_KEYS.sti == data.endpoint ||
          ENDPOINTS_KEYS.pc == data.endpoint) && (
          <>
            <hr />
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm mt-3">
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Chofer</div>
                <span>{data.containerMatch?.user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">RUT / DNI Chofer</div>
                <span>{data.containerMatch?.user.dni}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">País Chofer</div>
                <span>{data.containerMatch?.user.country}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Patente</div>
                <span>{data.containerMatch?.plateNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">
                  MIC/DTA de USPALLATA
                </div>
                <span>{data.containerMatch?.micdta}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">
                  Sello Aduana Argentina
                </div>
                <span>{data.containerMatch?.seal}</span>
              </div>
            </div>
          </>
        )}
        {ENDPOINTS_KEYS.silogport_tps == data.endpoint && (
          <>
            <hr />
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 mb-3 text-sm mt-3">
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Chofer</div>
                <span>{data.containerMatch?.user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">RUT / DNI Chofer</div>
                <span>{data.containerMatch?.user.dni}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">País Chofer</div>
                <span>{data.containerMatch?.user.country}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Patente</div>
                <span>{data.containerMatch?.plateNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">País Patente</div>
                <span>{data.containerMatch?.plateNumberCountry}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">
                  MIC/DTA Electrónico
                </div>
                <span>{data.containerMatch?.micdta}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">
                  Sello Aduana Argentina
                </div>
                <span>{data.containerMatch?.seal}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="capitalize font-semibold">Sello Linea</div>
                <span>{data.containerMatch?.sealLine}</span>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default DetailsModal;
