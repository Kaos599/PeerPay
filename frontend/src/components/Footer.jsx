import React from 'react'
import { Box, Text } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box as="footer" textAlign="center" py={4} fontSize="sm" color="gray.500">
      <Text>© {new Date().getFullYear()} Made by Harsh Dayal 22BCE10564</Text>
    </Box>
  )
} 