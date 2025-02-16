"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";

export const SubmitButton = (props: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} loading={pending} {...props} />
  );
};
