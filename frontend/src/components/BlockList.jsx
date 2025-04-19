import React from 'react';
import { SimpleGrid, SkeletonText, Center, Text } from '@chakra-ui/react';
import { useBlocks } from '../hooks/useBlocks';
import BlockCard from './BlockCard';

export default function BlockList() {
  const { data, isLoading, isError } = useBlocks();

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {Array(4).fill(0).map((_, i) => (
          <SkeletonText key={i} mt="4" noOfLines={4} spacing="4" />
        ))}
      </SimpleGrid>
    );
  }

  if (isError || !data?.length) {
    return (
      <Center>
        <Text color="red.500">Failed to load blocks</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      {data.map((block) => (
        <BlockCard key={block.hash} block={block} />
      ))}
    </SimpleGrid>
  );
} 