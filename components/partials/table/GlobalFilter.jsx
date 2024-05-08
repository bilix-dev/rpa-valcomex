import React, { useEffect, useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import { Icon } from "@iconify/react";
import { useAsyncDebounce } from "react-table";
const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = useAsyncDebounce(
    (value) => setFilter(value || undefined),
    0
  );

  useEffect(() => setValue(filter), [filter]);

  return (
    <div>
      <InputGroup
        append={<Icon icon="heroicons-outline:search" />}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Buscar..."
        type="text"
      />
    </div>
  );
};

export default GlobalFilter;
