import { useQuery } from '@tanstack/react-query'
import { fetchBlocks } from '../services/blockchain'

/**
 * Custom hook to fetch the list of blockchain blocks,
 * with polling every 5 seconds and 10s staleTime
 */
export function useBlocks() {
  return useQuery({
    queryKey: ['blocks'],
    queryFn: fetchBlocks,
    refetchInterval: 5000,
    staleTime: 10000,
  })
} 