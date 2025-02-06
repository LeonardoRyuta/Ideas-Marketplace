import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <Box minH="100vh" w="100vw">
      <Navbar />
      <Box as="main" p={4}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;