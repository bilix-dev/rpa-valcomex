import useSWRGet from "@/hooks/useSWRGet";
import BaseSelect from "./BaseSelect";
import { useMemo } from "react";

const RoleSelect = ({ operatorId, ...rest }) => {
  const { data: response, isLoading } = useSWRGet(
    `roles/operator/${operatorId}`
  );

  const roles = useMemo(
    () =>
      response?.data?.map((role) => ({
        label: role.name,
        value: role.id,
        isDisabled: role.super,
      })) ?? [],
    [response?.data]
  );

  return (
    <BaseSelect
      label={"Rol"}
      placeholder="Rol..."
      options={roles}
      isLoading={isLoading}
      {...rest}
    />
  );
};

export default RoleSelect;
