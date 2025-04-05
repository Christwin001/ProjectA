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
  type?: "single" | "multi";
  isInfiniteScroll?: boolean;
  triggerButtonProps: ButtonProps;
  popoverContentProps?: Omit<PopoverContentProps, "children">;
  onFetchMoreData?(): void;
  onSelectItem?: (item: T) => void;
  onSearch?: (query: string) => void;
  isItemSelected?: (item: T) => boolean;
  renderOptions?(options?: T[]): ReactNode;
  onSelectAll?: (isSelected: boolean) => void;
  renderItem?: (item: T, index?: number) => ReactNode;
};

export function OptionsMenu<T>(props: OptionsMenuProps<T>) {
  const {
    title,
    hasMore,
    options,
    isLoading,
    searchQuery,
    selectAllOption,
    type = "single",
    isInfiniteScroll,
    triggerButtonProps,
    popoverContentProps,
    id = "optionsMenuInfiniteScrollContainer",
    onSearch,
    renderItem,
    onSelectAll,
    onSelectItem,
    renderOptions,
    isItemSelected,
    onFetchMoreData,
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
      <PopoverContent zIndex={10} {...popoverContentProps}>
        {title && (
          <Text textStyle="sm" fontWeight="semibold" px={3} pb={2}>
            {title}
          </Text>
        )}
        <PopoverBody px="0" py={3}>
          {onSearch && (
            <Box px={3} position="relative" zIndex={10}>
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
          <Box id={id} maxH="300px" overflowY="auto" pt={onSearch ? 4 : 0}>
            {isLoading ? (
              <Flex
                w="full"
                h="full"
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
                  <Flex pt={4} alignItems="center" justifyContent="center">
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
                  <Stack mt={2} gap={0}>
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
