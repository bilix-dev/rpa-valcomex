import React from "react";
import { Icon } from "@iconify/react";
const LoadingIcon = ({ icon, isLoading, className, ...rest }) => {
  return (
    <>
      <Icon
        icon={!isLoading ? icon : "heroicons:arrow-path"}
        className={`${className} ${isLoading && "animate-spin"}`}
        {...rest}
      />
    </>
  );
};

export default LoadingIcon;
