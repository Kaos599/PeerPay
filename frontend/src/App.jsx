import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  extendTheme,
  Container,
  Flex,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from './components/Header';
import Footer from './components/Footer';
import BlockList from './components/BlockList';
import TransactionForm from './components/TransactionForm';
import TransactionHistoryPage from './components/TransactionHistoryPage';
import { Toaster } from 'react-hot-toast';

const theme = extendTheme({
  // Add custom theme configurations here
});

const queryClient = new QueryClient();

function App() {
  const [currentView, setCurrentView] = useState('blocks');

  const navButtonBg = useColorModeValue('gray.100', 'gray.700');
  const navButtonActiveBg = useColorModeValue('blue.500', 'blue.300');
  const navButtonActiveColor = useColorModeValue('white', 'gray.900');

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Toaster position="bottom-right" />
        <Box textAlign="center" fontSize="xl">
          <VStack minH="100vh" spacing={8}>
            <Header />
            <Container maxW="container.xl" flexGrow={1}>
              <Flex justify="center" mb={6} gap={4}>
                <Button
                  onClick={() => setCurrentView('blocks')}
                  isActive={currentView === 'blocks'}
                  bg={currentView === 'blocks' ? navButtonActiveBg : navButtonBg}
                  color={currentView === 'blocks' ? navButtonActiveColor : 'inherit'}
                  _hover={{
                    bg: currentView === 'blocks' ? navButtonActiveBg : useColorModeValue('gray.200', 'gray.600'),
                  }}
                >
                  Blocks & Add Transaction
                </Button>
                <Button
                  onClick={() => setCurrentView('history')}
                  isActive={currentView === 'history'}
                  bg={currentView === 'history' ? navButtonActiveBg : navButtonBg}
                  color={currentView === 'history' ? navButtonActiveColor : 'inherit'}
                  _hover={{
                    bg: currentView === 'history' ? navButtonActiveBg : useColorModeValue('gray.200', 'gray.600'),
                  }}
                >
                  Transaction History
                </Button>
              </Flex>

              {currentView === 'blocks' && (
                <VStack spacing={8} align="stretch">
                  <TransactionForm />
                  <BlockList />
                </VStack>
              )}

              {currentView === 'history' && <TransactionHistoryPage />}
            </Container>
            <Footer />
          </VStack>
        </Box>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App; 