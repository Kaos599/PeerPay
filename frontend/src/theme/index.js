import { extendTheme } from '@chakra-ui/react'

// Enable system-based dark/light mode toggling
const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

// Extend Chakra's default theme with our config
const theme = extendTheme({ config })

export default theme 