"use client";

import React from "react";
import {
  DialogBody,
  DialogRoot,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogActionTrigger, DialogRootProps } from "@chakra-ui/react";
import { Button } from "./button";
import { CloseButton } from "./close-button";

interface DeleteDialogProps extends Omit<DialogRootProps, "children"> {
  title: string;
  caption: string;
  isDeleting: boolean;
  confirmBtnText: string;
  onDelete(): void;
}

export const DeleteDialog = ({
  title,
  caption,
  isDeleting,
  confirmBtnText,
  onDelete,
  ...props
}: DeleteDialogProps) => {
  return (
    <DialogRoot {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{caption}</DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button size="xs" type="button" variant="outline">
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            size="xs"
            colorPalette="red"
            loading={isDeleting}
            onClick={onDelete}
          >
            {confirmBtnText}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger asChild>
          <CloseButton type="button" size="xs" />
        </DialogCloseTrigger>
      </DialogContent>
    </DialogRoot>
  );
};
