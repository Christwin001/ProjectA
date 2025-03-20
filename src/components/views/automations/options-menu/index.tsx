import { InfiniteScroll } from "@/components/layout/infinite-scroll";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Box,
  ButtonProps,
  Flex,
  Input,
  PopoverContentProps,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactNode, useRef, useState } from "react";
import { OptionMenuTriggerButton } from "./button";
import { OptionMenuMultiOption, OptionMenuSingleOption } from "./options";

export type OptionsMenuProps<T> = {
  id?: string;
  options?: T[];
  title?: string;
  hasMore?: boolean;
  isLoading?: boolean;
  selectAllOption?: T;
  searchQuery?: string;
  onFetchMoreData?(): void;
  type?: "single" | "multi";
  isInfiniteScroll?: boolean;
  triggerButtonProps: ButtonProps;
  onSelectItem?: (item: T) => void;
  onSearch?: (query: string) => void;
  isItemSelected?: (item: T) => boolean;
  renderOptions?(options?: T[]): ReactNode;
  onSelectAll?: (isSelected: boolean) => void;
  renderItem?: (item: T, index?: number) => ReactNode;
  popoverContentProps?: Omit<PopoverContentProps, "children">;
};

export function OptionsMenu<T>(props: OptionsMenuProps<T>) {
  const {
    title,
    hasMore,
    options,
    onSearch,
    isLoading,
    renderItem,
    searchQuery,
    onSelectAll,
    onSelectItem,
    renderOptions,
    isItemSelected,
    type = "single",
    onFetchMoreData,
    selectAllOption,
    isInfiniteScroll,
    triggerButtonProps,
    popoverContentProps,
    id = "optionsMenuInfiniteScrollContainer",
  } = props;

  const [open, setOpen] = useState(false);

  const [selectAll, setSelectAll] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSelectItem = (item: T) => {
    onSelectItem?.(item);
    if (type === "single") {
      setOpen(false);
    }
  };

  const handleClose = () => {
    onSearch?.("");
    setOpen(false);
  };

  const handleSelectAll = (select: boolean) => {
    setSelectAll(select);
    onSelectAll?.(select);
  };

  const Option =
    type === "single" ? OptionMenuSingleOption : OptionMenuMultiOption;

  return (
    <PopoverRoot
      open={open}
      positioning={{
        sameWidth: true,
      }}
      onOpenChange={({ open }) => setOpen(open)}
      initialFocusEl={() => searchInputRef.current}
    >
      <PopoverTrigger asChild>
        <OptionMenuTriggerButton
          onClick={() => setOpen(!open)}
          {...triggerButtonProps}
        />
      </PopoverTrigger>
      <PopoverContent
        zIndex={10}
        rounded="8px"
        borderWidth="0"
        boxShadow="0px 5px 20px rgba(21, 27, 38, 0.08)"
        _focus={{
          outline: "none",
          boxShadow: "0px 5px 20px rgba(21, 27, 38, 0.08)",
        }}
        {...popoverContentProps}
      >
        {title && (
          <Text textStyle="sm" fontWeight="semibold" px="0.75rem" pb="0.5rem">
            {title}
          </Text>
        )}
        <PopoverBody px="0" py="0.75rem">
          {onSearch && (
            <Box px="0.75rem" bg="white" position="relative" zIndex={10}>
              <Input
                size="xs"
                type="search"
                value={searchQuery}
                placeholder="Search"
                ref={searchInputRef}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </Box>
          )}
          <Box
            id={id}
            maxH="300px"
            overflowY="auto"
            pt={onSearch ? "2.5rem" : "0"}
          >
            {isLoading ? (
              <Flex
                width="100%"
                height="100%"
                alignItems="center"
                flexDirection="column"
                justifyContent="center"
              >
                <Spinner size="sm" />
              </Flex>
            ) : isInfiniteScroll ? (
              <InfiniteScroll
                hasMore={hasMore ?? false}
                style={{ overflow: "hidden" }}
                loadMore={() => onFetchMoreData?.()}
                loader={
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    paddingTop="2rem"
                  >
                    <Spinner color="blue.500" size="xs" />
                  </Flex>
                }
                endMessage={
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    paddingTop="2rem"
                  >
                    <Text>~ All loaded ~</Text>
                  </Flex>
                }
              >
                {renderOptions ? (
                  renderOptions(options)
                ) : (
                  <Stack mt="0.5rem" gap={0}>
                    {type === "multi" && selectAllOption && onSelectAll && (
                      <Option
                        item={selectAllOption}
                        renderItem={renderItem}
                        isSelected={selectAll}
                        onSelect={(e) => handleSelectAll(e.target.checked)}
                      />
                    )}
                    {options?.map((option, index) => (
                      <Option
                        item={option}
                        key={`${index}`}
                        renderItem={renderItem}
                        isSelected={isItemSelected?.(option)}
                        onSelect={() => handleSelectItem(option)}
                      />
                    ))}
                  </Stack>
                )}
              </InfiniteScroll>
            ) : (
              <>
                {type === "multi" && selectAllOption && onSelectAll && (
                  <Option
                    item={selectAllOption}
                    renderItem={renderItem}
                    isSelected={selectAll}
                    onSelect={(e) => handleSelectAll(e.target.checked)}
                  />
                )}
                {options?.map((option, index) => (
                  <Option
                    item={option}
                    key={`${index}`}
                    renderItem={renderItem}
                    isSelected={isItemSelected?.(option)}
                    onSelect={() => handleSelectItem(option)}
                  />
                ))}
              </>
            )}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
