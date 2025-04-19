import axios from 'axios'

// Configure base URL from environment or default to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
})

/**
 * Fetch the list of blocks from the backend API
 */
export async function fetchBlocks() {
  const { data } = await api.get('/blocks')
  return data
}

/**
 * Send a new transaction to be mined into a block
 * @param {{ sender: string; recipient: string; amount: number }} transaction
 */
export async function sendTransaction(transaction) {
  // The backend expects the transaction data nested under a 'data' key
  const payload = { data: transaction }; 
  // Update the endpoint to /mine
  const { data } = await api.post('/mine', payload) 
  return data
}

// Modify this function to extract transactions from blocks
export const getTransactions = async () => {
  // Fetch all blocks first
  const blocks = await fetchBlocks(); 

  // Extract transactions from blocks (skip genesis block at index 0)
  const transactions = blocks
    .slice(1) // Skip Genesis block
    .map(block => ({
      ...block.data, // Spread the transaction data (sender, recipient, amount)
      timestamp: block.timestamp, // Use the block's timestamp
      hash: block.hash, // Use the block's hash as a unique identifier for the row
      status: 'mined' // Assume all transactions in blocks are mined
    }))
    .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, newest first

  return transactions;
}; 