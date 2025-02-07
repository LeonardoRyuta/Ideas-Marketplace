import React from "react";
import {
  Box,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { Link } from "react-router";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: React.FC = () => {
  const links = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <Box px={4} bg="white" borderBottom="1px solid" borderColor="gray.200">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box fontWeight="bold">Ideas Marketplace</Box>
        <Flex alignItems="center">
          <Stack direction="row" gap={7} alignItems="center">
            {links.map((link) => (
              <Link to={link.to} key={link.to} style={{ color: "inherit" }}>
                {link.label}
              </Link>
            ))}
            <ConnectButton />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;