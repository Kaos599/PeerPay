import React from 'react';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, NumberInput, NumberInputField, useToast, useColorMode, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { sendTransaction } from '../services/blockchain';
import { z } from 'zod';

// Define Zod schema for transaction form validation
const transactionSchema = z.object({
  sender: z.string().min(1, 'Sender is required'),
  recipient: z.string().min(1, 'Recipient is required'),
  amount: z.number().positive('Amount must be positive'),
});

const MotionBox = motion(Box);

export default function TransactionForm({ onTransactionAdded }) {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(transactionSchema),
  });
  const mutation = useMutation({
    mutationFn: sendTransaction,
    onSuccess: () => {
      toast({ title: 'Transaction mined!', status: 'success', isClosable: true });
      if (onTransactionAdded) onTransactionAdded();
    },
    onError: () => {
      toast({ title: 'Failed to mine', status: 'error', isClosable: true });
    },
  });
  const onSubmit = (data) => mutation.mutate(data);

  return (
    <MotionBox
      p={6}
      rounded="md"
      bg={colorMode === 'dark' ? 'gray.700' : 'white'}
      boxShadow="md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.sender}>
            <FormLabel>Sender</FormLabel>
            <Input placeholder="0xabc..." {...register('sender')} />
            <FormErrorMessage>{errors.sender?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.recipient}>
            <FormLabel>Recipient</FormLabel>
            <Input placeholder="0xdef..." {...register('recipient')} />
            <FormErrorMessage>{errors.recipient?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.amount}>
            <FormLabel>Amount</FormLabel>
            <NumberInput>
              <NumberInputField {...register('amount', { valueAsNumber: true })} />
            </NumberInput>
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={mutation.isLoading}
            w="full"
            _hover={{ transform: 'scale(1.02)' }}
          >
            Mine Transaction
          </Button>
        </VStack>
      </form>
    </MotionBox>
  );
} 