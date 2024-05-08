import React from "react";
import { Tooltip as TT } from "react-tippy";
import "react-tippy/dist/tippy.css";

const Tooltip = ({
  children,
  content = "Default",
  position = "top",
  animation = "fade",
  trigger = "mouseenter",
  duration = "200",
  size = "small",
  ...rest
}) => {
  return (
    <TT
      title={content}
      trigger={trigger}
      duration={duration}
      size={size}
      animation={animation}
      position={position}
      {...rest}
    >
      {children}
    </TT>
  );
};

export default Tooltip;
