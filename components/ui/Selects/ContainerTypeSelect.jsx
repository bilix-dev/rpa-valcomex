import { useMemo } from "react";
import BaseSelect from "./BaseSelect";
import { CONTAINER_TYPE } from "@/helpers/helper";

const ContainerTypeSelect = ({ ...rest }) => {
  const types = useMemo(
    () =>
      Object.entries(CONTAINER_TYPE).map((x) => ({
        label: x[1],
        value: x[0],
      })),
    []
  );

  return (
    <BaseSelect
      label={"Tipo Contenedor"}
      placeholder="Tipo Contenedor..."
      options={types}
      {...rest}
    />
  );
};

export default ContainerTypeSelect;
