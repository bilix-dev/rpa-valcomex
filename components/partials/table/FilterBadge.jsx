import Badge from "@/components/ui/Badge";
import { useState } from "react";

export const FilterBadge = ({
  title,
  count,
  colorClass = "bg-success-500",
  filter,
  setFilter,
}) => {
  const [color, setColor] = useState(
    filter[filter?.findIndex((x) => x.data == title)].status
      ? colorClass
      : " bg-secondary-500"
  );
  return (
    <Badge
      onClick={() => {
        const index = filter?.findIndex((x) => x.data == title);
        const aux = filter;
        aux[index].status = !aux[index].status;
        setFilter([...aux]);
        setColor(aux[index].status ? colorClass : " bg-secondary-500");
      }}
      style={{
        cursor: "pointer",
      }}
      className={"text-white " + color}
      label={
        <div className="flex gap-1">
          {count}
          <div>{title}</div>
        </div>
      }
    />
  );
};
