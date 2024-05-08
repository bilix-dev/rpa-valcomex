const { default: Badge } = require("@/components/ui/Badge");
const { toFormatDateTime } = require("@/helpers/helper");

export const ValidityCell = ({ validity }) => {
  return (
    <div className="flex flex-col gap-1 items-end">
      <div>
        <Badge
          label={validity.status}
          className={`bg-${validity.type}-500 text-white w-min`}
          icon={`heroicons-outline:${
            validity.type != "Vencido" ? "check" : "x-mark"
          }`}
        />
      </div>
      <div>
        <span className={`text-${validity.type}-500`}>{validity.date}</span>
      </div>
    </div>
  );
};

export const ExitCell = ({ type, date }) => {
  return (
    <div className="flex flex-col gap-1 items-end">
      <div>
        <Badge
          className={"bg-slate-500 text-white w-min"}
          label={type.toLowerCase()}
          icon={`heroicons-outline:document-check`}
        />
      </div>
      <div>
        <Badge
          className={"bg-primary-500 text-white w-min"}
          label={`Salida`}
          icon={`heroicons-outline:truck`}
        />
      </div>
      <div>
        <span className={"text-primary-500"}>
          Desde {toFormatDateTime(date, false)}
        </span>
      </div>
    </div>
  );
};
