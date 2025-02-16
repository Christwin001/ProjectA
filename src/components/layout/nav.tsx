"use client";

import { ColorModeButton } from "@/components/ui/color-mode";
import { Flex, VStack } from "@chakra-ui/react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoChatbubble } from "react-icons/io5";
import React from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton, IconButtonProps } from "@chakra-ui/react";

export const Nav = () => {
  const pathname = usePathname();

  return (
    <Flex
      h="full"
      py={2}
      px={3}
      w={16}
      bg="bg.muted"
      borderRightWidth={1}
      flexDirection="column"
      justifyContent="space-between"
    >
      <VStack>
        <Link href="/app">
          <NavButton
            tooltipContent="Chat"
            variant={pathname === "/app" ? "subtle" : "ghost"}
          >
            <IoChatbubble size={20} />
          </NavButton>
        </Link>
      </VStack>
      <VStack>
        <ColorModeButton rounded="full" size="md" />
        <Link href="/app/settings">
          <NavButton
            tooltipContent="Settings"
            variant={
              ["/app/settings", "/app/settings/notifications"].includes(
                pathname
              )
                ? "subtle"
                : "ghost"
            }
          >
            <FaGear size={20} />
          </NavButton>
        </Link>
        <Link href="/app/settings/profile">
          <NavButton
            tooltipContent="Profile"
            variant={pathname === "/app/settings/profile" ? "subtle" : "ghost"}
          >
            <FaUserCircle size={24} />
          </NavButton>
        </Link>
      </VStack>
    </Flex>
  );
};

export interface NavButtonProps extends IconButtonProps {
  tooltipContent: string;
}

export const NavButton = (props: NavButtonProps) => {
  const { tooltipContent, ...rest } = props;

  return (
    <Tooltip
      content={tooltipContent}
      positioning={{
        placement: "left",
      }}
    >
      <IconButton rounded="full" variant="ghost" size="md" {...rest} />
    </Tooltip>
  );
};
