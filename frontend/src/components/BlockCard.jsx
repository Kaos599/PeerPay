import React from 'react'
import { Box, VStack, Text, Badge, Tooltip, useColorMode, useDisclosure } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import BlockModal from './BlockModal'

const MotionBox = motion(Box)

export default function BlockCard({ block }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode()

  return (
    <>
      <MotionBox
        p={4}
        bg={colorMode === 'dark' ? 'gray.700' : 'white'}
        rounded="md"
        boxShadow="sm"
        cursor="pointer"
        whileHover={{ scale: 1.03 }}
        onClick={onOpen}
      >
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">#{block.index}</Text>
          <Tooltip label="Timestamp when block was mined" aria-label="Timestamp tip">
            <Text fontSize="sm" color="gray.500">
              {new Date(block.timestamp).toLocaleString()}
            </Text>
          </Tooltip>
          <Badge colorScheme="purple">{block.hash.slice(0, 10)}…</Badge>
        </VStack>
      </MotionBox>
      <BlockModal isOpen={isOpen} onClose={onClose} block={block} />
    </>
  )
} 