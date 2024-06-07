import useSWRGet from "@/hooks/useSWRGet";
import BaseSelect from "./BaseSelect";
import React, { useEffect, useMemo, useState } from "react";
import { toFormatContainer } from "@/helpers/helper";

const PendingContainerSelect = React.forwardRef(
  ({ operatorId, setValues, minInputLength = 5, ...rest }, ref) => {
    const { data: response, isLoading } = useSWRGet(
      `containers/select/operator/${operatorId}`
    );
    const [show, setShow] = useState(false);

    const containers = useMemo(
      () =>
        response?.data?.map((cnt) => ({
          label: `${toFormatContainer(cnt.name)} [${cnt.serviceOrder.code}]`,
          value: cnt.id,
        })) ?? [],
      [response?.data]
    );

    useEffect(
      () => (response?.data ? setValues(response?.data) : setValues([])),
      [response?.data]
    );

    return (
      <BaseSelect
        ref={ref}
        label={"Contenedor"}
        placeholder="Contenedor..."
        options={show ? containers : []}
        isLoading={isLoading}
        noOptionsMessage={({ inputValue }) => {
          return minInputLength - inputValue.length > 0
            ? `Debe ingresar ${
                minInputLength - inputValue.length
              } caracteres más`
            : "No hay resultados";
        }}
        onInputChange={(e) => {
          if (e.length >= minInputLength) {
            setShow(true);
          } else {
            setShow(false);
          }
        }}
        {...rest}
      />
    );
  }
);

export default PendingContainerSelect;
