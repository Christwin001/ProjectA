import { ButtonProps, Button } from "@chakra-ui/react";
import React, { forwardRef } from "react";

export const OptionMenuTriggerButton = forwardRef(
  (props: ButtonProps, ref: any) => {
    return <Button size="xs" ref={ref} {...props} />;
  }
);

OptionMenuTriggerButton.displayName = "OptionMenuTriggerButton";
