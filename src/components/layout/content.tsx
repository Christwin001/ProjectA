import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  StackProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { Link as NextLink } from "next-view-transitions";
import { LuArrowLeft } from "react-icons/lu";

export const ViewContent = (props: FlexProps) => {
  return (
    <Flex
      h="full"
      minW={400}
      maxW={400}
      bg="bg.panel"
      borderRightWidth={1}
      flexDirection="column"
      {...props}
    />
  );
};

export const MainContent = (props: BoxProps) => {
  return (
    <Box h="full" flex={1} bg="bg.panel" w="calc(100% - 464px)" {...props} />
  );
};

interface ViewHeaderProps extends StackProps {
  href: string;
  labelProps?: TextProps;
}

export const ViewHeader = ({
  href,
  children,
  labelProps,
  ...rest
}: ViewHeaderProps) => {
  return (
    <HStack w="full" px={6} h="60px" {...rest}>
      <NextLink href={href}>
        <IconButton size="sm" rounded="full" variant="ghost">
          <LuArrowLeft />
        </IconButton>
      </NextLink>
      <Text fontWeight="medium" {...labelProps}>
        {children}
      </Text>
    </HStack>
  );
};
