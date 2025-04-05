"use client";

import { ColorModeButton } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { Flex, IconButton, IconButtonProps, VStack } from "@chakra-ui/react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { FaCirclePlay, FaGear } from "react-icons/fa6";
import { IoCalendarNumber, IoChatbubble, IoPieChart } from "react-icons/io5";

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
        <Link href="/app?filter=assigned">
          <NavButton
            tooltipContent="Chats"
            variant={pathname === "/app" ? "subtle" : "ghost"}
          >
            <IoChatbubble size={20} />
          </NavButton>
        </Link>
        <Link href="/app/bookings">
          <NavButton
            tooltipContent="Bookings"
            variant={pathname.includes("/app/bookings") ? "subtle" : "ghost"}
          >
            <IoCalendarNumber size={20} />
          </NavButton>
        </Link>
        <Link href="/app/automations">
          <NavButton
            tooltipContent="Automations"
            variant={pathname.includes("/app/automations") ? "subtle" : "ghost"}
          >
            <FaCirclePlay size={20} />
          </NavButton>
        </Link>
        <Link href="/app/analytics">
          <NavButton
            tooltipContent="Analytics"
            variant={pathname === "/app/analytics" ? "subtle" : "ghost"}
          >
            <IoPieChart size={20} />
          </NavButton>
        </Link>
      </VStack>
      <VStack>
        <ColorModeButton rounded="full" size="md" />
        <Link href="/app/settings">
          <NavButton
            tooltipContent="Settings"
            variant={
              [
                "/app/settings",
                "/app/settings/accounts",
                "/app/settings/saved-replies",
                "/app/settings/saved-replies/new",
              ].includes(pathname) ||
              pathname.startsWith("/app/settings/saved-replies/")
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
      openDelay={100}
      content={tooltipContent}
      positioning={{
        placement: "left",
      }}
    >
      <IconButton rounded="full" variant="ghost" size="md" {...rest} />
    </Tooltip>
  );
};
