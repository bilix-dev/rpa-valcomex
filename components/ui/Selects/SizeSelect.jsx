import { useMemo } from "react";
import BaseSelect from "./BaseSelect";
import { SIZE } from "@/helpers/helper";

const SizeSelect = ({ ...rest }) => {
  const size = useMemo(
    () =>
      Object.entries(SIZE).map((x) => ({
        label: x[1],
        value: x[0],
      })),
    []
  );

  return (
    <BaseSelect
      label={"Tamaño"}
      placeholder="Tamaño..."
      options={size}
      {...rest}
    />
  );
};

export default SizeSelect;
