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
  const { data } = await api.post('/transactions', transaction)
  return data
} 