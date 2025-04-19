import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../services/blockchain';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Alert,
  AlertIcon,
  Code,
  Text,
  Link,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLink } from 'lucide-react';

const TransactionHistoryPage = () => {
  const { data: transactions, isLoading, error, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    refetchInterval: 15000, // Refetch every 15 seconds, adjust as needed
  });

  const tableBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'mined':
        return <Badge colorScheme="green">Mined</Badge>;
      case 'pending':
        return <Badge colorScheme="yellow">Pending</Badge>;
      case 'failed':
        return <Badge colorScheme="red">Failed</Badge>;
      default:
        return <Badge>{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <Box py={8} px={{ base: 4, md: 8 }}>
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Transaction History
      </Heading>

      {isLoading && (
        <Box textAlign="center" my={10}>
          <Spinner size="xl" />
          <Text mt={2}>Loading transactions...</Text>
        </Box>
      )}

      {isError && (
        <Alert status="error" my={5} variant="subtle">
          <AlertIcon />
          Error fetching transaction history: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <TableContainer
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          bg={tableBg}
          boxShadow="md"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Timestamp</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th isNumeric>Amount</Th>
                <Th>Status</Th>
                <Th>Hash</Th> {/* Assuming a transaction hash exists */}
              </Tr>
            </Thead>
            <Tbody>
              {transactions && transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <Tr key={tx.hash || index} _hover={{ bg: hoverBg }}>
                    <Td>{formatTimestamp(tx.timestamp)}</Td>
                    <Td>
                      <Code fontSize="sm">{tx.sender}</Code>
                    </Td>
                    <Td>
                      <Code fontSize="sm">{tx.recipient}</Code>
                    </Td>
                    <Td isNumeric>{tx.amount}</Td>
                    <Td>{getStatusBadge(tx.status)}</Td>
                    <Td>
                      {tx.hash ? (
                        <Link
                          href={`/transaction/${tx.hash}`} // Link to a potential detail page
                          isExternal={false} // Change if it's an external explorer
                          color="blue.500"
                          fontSize="sm"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          <Code fontSize="sm">{`${tx.hash.substring(0, 8)}...${tx.hash.substring(tx.hash.length - 8)}`}</Code>
                          {/* <ExternalLink size={12} style={{ marginLeft: '4px', display: 'inline' }} /> */}
                        </Link>
                      ) : (
                        'N/A'
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={10}>
                    No transactions found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TransactionHistoryPage; 