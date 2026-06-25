import { useQuery } from '@tanstack/react-query'
import { debtsService } from '../services/debts.service'

export const useDebts = () => {
  return useQuery({
    queryKey: ['debts'],
    queryFn: debtsService.getDebts,
  })
}
