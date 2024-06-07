import React, { useEffect, useState } from "react";
import Select from "react-select";

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const BaseSelect = React.forwardRef(
  (
    {
      label = "Label",
      placeholder = "Placeholder",
      options = [],
      isLoading = false,
      defaultValue = null,
      isMulti,
      onChange,
      error,
      ...rest
    },
    ref
  ) => {
    const [value, setValue] = useState();

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
        <Select
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
          isMulti={isMulti}
          isLoading={isLoading}
          loadingMessage={() => "Cargando..."}
          noOptionsMessage={({ inputValue }) =>
            !inputValue ? "Sin opciones" : "No hay resultados"
          }
          {...rest}
        />
        {error && (
          <div className={`mt-2 text-danger-500 block text-sm`}>
            {error.message}
          </div>
        )}
      </div>
    );
  }
);

export default BaseSelect;
