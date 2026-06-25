import { useQuery } from '@tanstack/react-query'
import { creditService } from '../services/credit.service'

export const useCredits = () => {
  return useQuery({
    queryKey: ['credits'],
    queryFn: () => creditService.getCredits(),
  })
}
