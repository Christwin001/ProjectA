"use client";

import { Card, Flex, Heading, Spinner } from "@chakra-ui/react";
import React from "react";

export const CSATAnalyticsLoading = () => {
  return (
    <Card.Root w={["100%", "100%", "100%", "50%"]}>
      <Card.Header pb="0">
        <Heading as="h4" fontWeight="medium" textStyle="sm">
          CSAT rating distribution
        </Heading>
      </Card.Header>
      <Card.Body>
        <Flex h="40vh" alignItems="center" justifyContent="center">
          <Spinner />
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
