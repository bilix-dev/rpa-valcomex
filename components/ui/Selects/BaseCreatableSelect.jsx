import { validateEmail } from "@/helpers/helper";
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const BaseCreatableSelect = React.forwardRef(
  (
    {
      label = "Label",
      placeholder = "Placeholder",
      options = [],
      isLoading = false,
      defaultValue = null,
      onChange,
      isMulti,
      max = 1000,
      ...rest
    },
    ref
  ) => {
    const [value, setValue] = useState(isMulti ? [] : null);

    useEffect(() => {
      if (!isLoading)
        setValue(
          isMulti
            ? options.filter((x) => defaultValue?.includes(x.value))
            : options.find((x) => x.value == defaultValue)
        );
    }, [isLoading]);

    return (
      <div className="fromGroup">
        {label && (
          <label className="block capitalize form-label">{label}</label>
        )}
        <CreatableSelect
          ref={ref}
          className="react-select"
          classNamePrefix="select"
          options={options}
          value={value}
          onChange={(val) => {
            const result = isMulti ? val?.map((x) => x.value) : val?.value;
            if (onChange) onChange(result);
            setValue(val);
          }}
          placeholder={placeholder}
          styles={styles}
          isLoading={isLoading}
          isMulti={isMulti}
          isOptionDisabled={(option) => isMulti && value?.length >= max}
          loadingMessage={() => "Cargando..."}
          noOptionsMessage={({ input }) =>
            !input ? "Sin opciones" : "No hay resultados"
          }
          formatCreateLabel={(inputText) => `Crear ${inputText}`}
          onCreateOption={(val) => {
            if (validateEmail(val)) {
              let newValue = [
                ...value,
                { value: val, label: val, __isNew__: true },
              ];
              const result = isMulti
                ? newValue.map((x) => x.value)
                : newValue.value;
              if (onChange) onChange(result);
              setValue(newValue);
            }
          }}
          {...rest}
        />
      </div>
    );
  }
);

export default BaseCreatableSelect;
