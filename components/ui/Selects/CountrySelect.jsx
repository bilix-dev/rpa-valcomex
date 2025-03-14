import { useMemo } from "react";
import BaseSelect from "./BaseSelect";
import { COUNTRY } from "@/helpers/helper";

const CountrySelect = ({ ...rest }) => {
  const countries = useMemo(
    () =>
      Object.entries(COUNTRY)
        .map((x) => ({
          label: x[1],
          value: x[1],
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  return (
    <BaseSelect
      label={"País"}
      placeholder="País..."
      options={countries}
      {...rest}
    />
  );
};

export default CountrySelect;
