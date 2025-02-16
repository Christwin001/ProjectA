"use client";

import { InputGroup } from "@/components/ui/input-group";
import { Input, InputProps } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

export const SearchInput = (props: InputProps) => {
  return (
    <InputGroup w="full" startElement={<LuSearch />}>
      <Input type="search" _placeholder={{ color: "fg.muted" }} {...props} />
    </InputGroup>
  );
};
