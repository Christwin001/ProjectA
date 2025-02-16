"use client";

import React, { PropsWithChildren } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { GridPattern } from "@/components/layout/grid-pattern";
import { Container, Flex } from "@chakra-ui/react";

export default function AuthLayoutTemplate({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <Flex
      w="full"
      minH="100vh"
      align="center"
      justify="center"
      overflow="hidden"
      position="relative"
    >
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 10],
          [10, 15],
          [15, 10],
        ]}
        css={{
          maskImage:
            "linear-gradient(to bottom left, white, transparent, transparent)",
        }}
      />
      <AnimatePresence>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Container
            py={6}
            w="100%"
            maxW="sm"
            minW="sm"
            shadow="sm"
            rounded="sm"
            bg="bg.panel"
          >
            {children}
          </Container>
        </motion.div>
      </AnimatePresence>
    </Flex>
  );
}
