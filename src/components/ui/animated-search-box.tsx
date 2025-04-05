"use client";

import useClickAway from "@/hooks/use-click-away";
import { Box, IconButton, Input, InputProps } from "@chakra-ui/react";
import { MotionConfig, motion } from "motion/react";
import { useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";

export const AnimatedSearchBox = (props: InputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(containerRef, () => {
    setIsOpen(false);
  });

  return (
    <MotionConfig
      transition={{
        type: "spring",
        bounce: 0.1,
        duration: 0.2,
      }}
    >
      <Box ref={containerRef}>
        <motion.div
          animate={{
            width: isOpen ? "300px" : "auto",
          }}
          initial={false}
        >
          <Box overflow="hidden">
            {!isOpen ? (
              <IconButton
                size="xs"
                variant="ghost"
                rounded="full"
                onClick={() => setIsOpen(true)}
              >
                <LuSearch />
              </IconButton>
            ) : (
              <Input size="xs" autoFocus {...props} />
            )}
          </Box>
        </motion.div>
      </Box>
    </MotionConfig>
  );
};
