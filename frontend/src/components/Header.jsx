import React from 'react'
import { Flex, Heading, Spacer, IconButton, useColorMode } from '@chakra-ui/react'
import { Sun, Moon } from 'lucide-react'

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex
      as="header"
      px={8}
      py={4}
      align="center"
      bg={colorMode === 'dark' ? 'gray.900' : 'white'}
      boxShadow="sm"
    >
      <Heading size="md">PeerPay</Heading>
      <Spacer />
      <IconButton
        aria-label="Toggle dark mode"
        icon={colorMode === 'dark' ? <Sun /> : <Moon />}
        onClick={toggleColorMode}
        variant="ghost"
      />
    </Flex>
  )
}

export default Header 