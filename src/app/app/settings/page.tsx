import { signOut } from "@/auth";
import { MainContent, ViewContent } from "@/components/layout/content";
import { SettingsItem } from "@/components/layout/settings";
import { Button } from "@/components/ui/button";
import { Link as ChakraLink, Flex, Heading, HStack } from "@chakra-ui/react";
import { ProfileDetails } from "@simpu/inbox-sdk";
import { Link as NextLink } from "next-view-transitions";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOut, IoShareSocialSharp } from "react-icons/io5";

export default async function SettingsPage() {
  return (
    <>
      <ViewContent>
        <Flex alignItems="center" px={6} h="60px">
          <Heading>Settings</Heading>
        </Flex>
        <ChakraLink
          w="full"
          asChild
          rounded="0"
          borderBottomWidth={1}
          _hover={{ bg: "bg.subtle", textDecoration: "none" }}
        >
          <NextLink href="/app/settings/profile">
            <ProfileDetails />
          </NextLink>
        </ChakraLink>
        <SettingsItem.Root href="/app/settings/profile">
          <SettingsItem.Icon>
            <FaUserCircle size={20} />
          </SettingsItem.Icon>
          <SettingsItem.Content>Profile</SettingsItem.Content>
        </SettingsItem.Root>
        <SettingsItem.Root href="/app/settings/accounts">
          <SettingsItem.Icon>
            <IoShareSocialSharp size={20} />
          </SettingsItem.Icon>
          <SettingsItem.Content>Accounts</SettingsItem.Content>
        </SettingsItem.Root>
        <form
          style={{ height: "60px", width: "100%" }}
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button
            p={0}
            h="full"
            w="full"
            rounded="0"
            type="submit"
            variant="plain"
            textAlign="left"
            colorPalette="red"
            _hover={{ bg: "bg.subtle", textDecoration: "none" }}
          >
            <HStack w="full">
              <SettingsItem.Icon>
                <IoLogOut size={20} />
              </SettingsItem.Icon>
              <SettingsItem.Content>Logout</SettingsItem.Content>
            </HStack>
          </Button>
        </form>
      </ViewContent>
      <MainContent />
    </>
  );
}
