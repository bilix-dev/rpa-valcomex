import React from "react";
import { CONTAINER_STATUS, toFormatDateTime } from "@/helpers/helper";
import { Icon } from "@iconify/react";
import Tooltip from "./Tooltip";

const IconBar = ({ type, current, next, date, voided = false }) => {
  const isNow = type == current;
  const isNext = type == next;
  const isFuture = date == null;

  let icon = `heroicons-solid:minus-circle`;
  let color = "text-slate-500";
  let size = 18;

  if (voided) {
    icon = `heroicons-solid:x-circle`;
    color = "text-danger-500";
  } else {
    if (isNow) {
      icon = `heroicons-solid:check-circle`;
      color = "text-success-500";
    } else if (isNext) {
      icon = `heroicons-solid:exclamation-circle`;
      color = "text-primary-500";
      size = 24;
    } else if (!isFuture) {
      icon = `heroicons-solid:check-circle`;
      color = "text-success-500";
    }
  }
  return (
    <Tooltip
      html={
        <div className="flex flex-row gap-2">
          <div className="lowercase capitalize">{type}</div>
          {!isFuture && <div>{toFormatDateTime(date)}</div>}
        </div>
      }
      placement="top"
      arrow
      animation="fade"
    >
      <div>
        <Icon height={size} className={color} icon={icon} />
      </div>
    </Tooltip>
  );
};

const StatusBar = ({ data }) => {
  const status = data.status;
  let next = null;

  if (status == CONTAINER_STATUS.ANULADO)
    return (
      <div className="flex flex-row items-center">
        <IconBar voided type={status} date={data.voidDate} />
      </div>
    );

  switch (status) {
    case CONTAINER_STATUS.PENDIENTE:
      next = CONTAINER_STATUS.MATCH;
      break;
    case CONTAINER_STATUS.MATCH:
      next = CONTAINER_STATUS.ESPERA;
      break;
    case CONTAINER_STATUS.ESPERA:
      next = CONTAINER_STATUS.TRAMITADO;
      break;
    case CONTAINER_STATUS.TRAMITADO:
      next = CONTAINER_STATUS.FINALIZADO;
      break;
    case CONTAINER_STATUS.FINALIZADO:
      next = CONTAINER_STATUS.FINALIZADO;
      break;
  }

  return (
    <div className="flex flex-row items-center">
      <IconBar
        type={CONTAINER_STATUS.PENDIENTE}
        current={status}
        next={next}
        date={data.createdAt}
      />
      <IconBar
        type={CONTAINER_STATUS.MATCH}
        current={status}
        next={next}
        date={data.matchDate}
      />
      <IconBar
        type={CONTAINER_STATUS.ESPERA}
        current={status}
        next={next}
        date={data.waitingDate}
      />
      <IconBar
        type={CONTAINER_STATUS.TRAMITADO}
        current={status}
        next={next}
        date={data.processedDate}
      />
      <IconBar
        type={CONTAINER_STATUS.FINALIZADO}
        current={status}
        next={next}
        date={data.endDate}
      />
    </div>
  );
};

export default StatusBar;
