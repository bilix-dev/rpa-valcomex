import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { dateDiff } from "@/helpers/helper";
import { useEffect, useRef, useState } from "react";
import { useAsyncDebounce } from "react-table";
import InputGroup from "@/components/ui/InputGroup";

export const Filter = ({ column }) => {
  const { setFilter, filterValue, filterOptions = {} } = column;
  const [value, setValue] = useState(filterValue);
  const onChange = useAsyncDebounce(
    (value) => setFilter(value || undefined),
    500
  );

  useEffect(() => setValue(filterValue), [filterValue]);

  return (
    <div className="flex mt-2 w-32" onClick={(e) => e.stopPropagation()}>
      <InputGroup
        type={"text"}
        min={"0"}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Buscar..."
        {...filterOptions}
      />
    </div>
  );
};

export const DateFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  const [selected, setSelected] = useState(filterValue ?? []);
  const ref = useRef(null);
  useEffect(() => {
    const value = filterValue ?? [];
    setSelected(value);
    ref?.current?.flatpickr.setDate(value);
  }, [filterValue]);

  return (
    <div className="flex mt-2 w-52" onClick={(e) => e.stopPropagation()}>
      <Flatpickr
        ref={ref}
        value={selected}
        placeholder="Buscar..."
        className="form-control py-1"
        options={{
          locale: Spanish,
          mode: "range",
          dateFormat: "d-m-Y",
          maxDate: new Date(),
          disable: [
            (date) => {
              if (selected.length == 0) return false;

              const diff = Math.abs(dateDiff(date, selected[0]));

              return diff > 365;
            },
          ],
          onReady: (selectedDates, dateStr, instance) => {
            let clear = document.createElement("button");
            clear.appendChild(document.createTextNode("Limpiar"));
            clear.addEventListener("click", (e) => instance.clear(), false);
            let container = document.createElement("div");
            container.appendChild(clear);
            container.className =
              "flex flatpickr-innerContainer justify-center pt-1 pb-1";
            instance.calendarContainer.append(container);
          },
          onChange: (selectedDates) => {
            if (selectedDates.length == 0) setSelected([]);
            else setSelected(selectedDates);
          },
          onClose: (selectedDates, dateStr, instance) => {
            let currentDate = selectedDates;
            if (selectedDates.length == 0) {
              currentDate = [];
              instance.setDate(currentDate, true);
            }
            if (selectedDates.length == 1) {
              currentDate = [selectedDates[0], selectedDates[0]];
              instance.setDate(currentDate, true);
            }
            setFilter(currentDate.length == 0 ? undefined : currentDate);
          },
        }}
      />
    </div>
  );
};
