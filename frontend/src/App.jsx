import React from 'react';
import { Flex, Container, Box, useColorMode } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import TransactionForm from './components/TransactionForm';
import BlockList from './components/BlockList';

function App() {
  const { colorMode } = useColorMode();

  return (
    <Flex direction="column" minH="100vh" bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}>
      <Header />
      <Container as="main" flex="1" py={8} maxW="7xl">
        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          <Box flex="1">
            <TransactionForm />
          </Box>
          <Box flex="2">
            <BlockList />
          </Box>
        </Flex>
      </Container>
      <Footer />
    </Flex>
  );
}

export default App; 