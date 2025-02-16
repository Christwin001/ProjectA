import {
  Link as ChakraLink,
  Flex,
  FlexProps,
  HStack,
  StackProps,
} from "@chakra-ui/react";
import { Link as NextLink } from "next-view-transitions";
import { LinkProps } from "next/link";

export const SettingsItemIcon = (props: FlexProps) => {
  return (
    <Flex
      px="4"
      py="2"
      h="60px"
      align="center"
      justify="center"
      flexBasis="auto"
      flexWrap="nowrap"
      {...props}
    />
  );
};

export const SettingsItemContent = (props: FlexProps) => {
  return (
    <Flex
      py="2"
      flex={1}
      h="60px"
      textStyle="sm"
      justify="center"
      direction="column"
      fontWeight="medium"
      borderBottomWidth={1}
      {...props}
    />
  );
};

export const SettingsItemRoot = (
  props: StackProps & { href: LinkProps["href"] }
) => {
  const { href, colorPalette, ...rest } = props;

  return (
    <ChakraLink
      w="full"
      asChild
      rounded="0"
      colorPalette={colorPalette}
      _hover={{ bg: "bg.subtle", textDecoration: "none" }}
    >
      <NextLink href={href}>
        <HStack w="full" {...rest} />
      </NextLink>
    </ChakraLink>
  );
};

export const SettingsItem = {
  Icon: SettingsItemIcon,
  Root: SettingsItemRoot,
  Content: SettingsItemContent,
};
