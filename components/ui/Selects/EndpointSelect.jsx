import { useMemo } from "react";
import BaseSelect from "./BaseSelect";
import { ENDPOINTS } from "@/helpers/helper";

const EndpointSelect = ({ ...rest }) => {
  const endpoints = useMemo(
    () =>
      Object.entries(ENDPOINTS)
        .filter((x) => x[1] != ENDPOINTS.silogport && x[1] != ENDPOINTS.tps)
        .map((x) => ({
          label: x[1],
          value: x[0],
        })),
    []
  );

  return (
    <BaseSelect
      label={"Destino"}
      placeholder="Destino..."
      options={endpoints}
      {...rest}
    />
  );
};

export default EndpointSelect;
