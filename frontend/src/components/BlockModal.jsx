import React from 'react'
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, Code, Accordion,
  AccordionItem, AccordionButton, AccordionPanel,
  AccordionIcon, Box, useColorMode
} from '@chakra-ui/react'

export default function BlockModal({ isOpen, onClose, block }) {
  const { colorMode } = useColorMode()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={colorMode === 'dark' ? 'gray.800' : 'white'}>
        <ModalHeader>Block #{block.index} Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Accordion allowMultiple>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">Hashes</Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Code mb={2} display="block" p={2}>{`Prev: ${block.previousHash}`}</Code>
                <Code p={2}>{`Hash: ${block.hash}`}</Code>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">Raw JSON</Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Code whiteSpace="pre-wrap">{JSON.stringify(block, null, 2)}</Code>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 