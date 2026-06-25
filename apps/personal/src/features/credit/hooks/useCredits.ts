import { useQuery } from '@tanstack/react-query'
import { creditService } from '../services/credit.service'

export const useCredits = (type?: string) => {
  return useQuery({
    queryKey: ['credits', type],
    queryFn: () => creditService.getCredits(type),
  })
}
