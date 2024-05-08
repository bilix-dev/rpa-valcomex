import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import LoadingIcon from "../ui/LoadingIcon";

const BaseDatePickr = ({ error, options, ...rest }) => (
  <>
    <div className="flex">
      <span className="flex-none input-group-addon">
        <div className="input-group-text  h-full prepend-slot">
          <LoadingIcon icon="heroicons-outline:calendar-days" />
        </div>
      </span>
      <Flatpickr
        className={`form-control py-2 ${
          error
            ? " border-danger-500 focus:ring-danger-500  focus:ring-opacity-90 focus:ring-1"
            : ""
        } `}
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        options={{
          locale: Spanish,
          ...options,
        }}
        {...rest}
      />
    </div>
    {error && (
      <div className={` mt-2 text-danger-500 block text-sm`}>
        {error.message}
      </div>
    )}
  </>
);

export const HoursDatePickr = ({ ...rest }) => (
  <BaseDatePickr
    options={{
      enableTime: true,
      dateFormat: "d-m-Y H:i",
      time_24hr: true,
    }}
    {...rest}
  />
);

export const DaysDatePickr = ({ ...rest }) => (
  <BaseDatePickr
    options={{
      dateFormat: "d-m-Y",
    }}
    {...rest}
  />
);
