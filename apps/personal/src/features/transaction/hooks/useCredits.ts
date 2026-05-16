import { useQuery } from '@tanstack/react-query';
import { Account } from '../types/transaction.types';

// Mock data to bypass backend 500 errors for now
const MOCK_CREDITS: Account[] = [
  {
    id: 'cc-bca',
    name: 'BCA Everyday Card',
    account_type: 'credit',
    balance: -3200000,
    currency: 'IDR',
    provider: { name: 'Bank BCA' },
    credit: {
      credit_type: 'credit_card',
      limit: 20000000,
      total_amount: 3200000,
      installment_amount: 320000,
      due_date: '2026-05-20',
      interest_rate: 1.75,
      billing_cycle_day: 5,
    }
  },
  {
    id: 'cc-mandiri',
    name: 'Mandiri Skyz',
    account_type: 'credit',
    balance: -8500000,
    currency: 'IDR',
    provider: { name: 'Bank Mandiri' },
    credit: {
      credit_type: 'credit_card',
      limit: 15000000,
      total_amount: 8500000,
      installment_amount: 850000,
      due_date: '2026-05-15',
      interest_rate: 1.75,
      billing_cycle_day: 1,
    }
  },
  {
    id: 'kta-digibank',
    name: 'Digibank KTA',
    account_type: 'loan',
    balance: -31250000,
    currency: 'IDR',
    provider: { name: 'DBS' },
    credit: {
      credit_type: 'kta',
      limit: 50000000,
      total_amount: 31250000,
      installment_amount: 1400000,
      due_date: '2026-05-14',
      interest_rate: 8.5,
      tenor_months: 48,
    }
  },
  {
    id: 'kpr-btn',
    name: 'KPR BTN Sentosa',
    account_type: 'loan',
    balance: -480000000,
    currency: 'IDR',
    provider: { name: 'Bank BTN' },
    credit: {
      credit_type: 'kpr',
      limit: 720000000,
      total_amount: 480000000,
      installment_amount: 4800000,
      due_date: '2026-05-25',
      interest_rate: 6.75,
      tenor_months: 240,
    }
  },
  {
    id: 'pl-gopay',
    name: 'GoPay Later',
    account_type: 'credit',
    balance: -1200000,
    currency: 'IDR',
    provider: { name: 'GoTo' },
    credit: {
      credit_type: 'paylater',
      limit: 5000000,
      total_amount: 1200000,
      installment_amount: 120000,
      due_date: '2026-05-28',
    }
  }
];

export const useCredits = () => {
  return useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      // Forcing dummy data as requested to avoid 500 errors
      return MOCK_CREDITS;
      
      /* 
      // Original API Logic:
      const response = await accountService.getAccounts();
      const credits = response.data.filter(
        (acc: Account) => acc.account_type === 'credit' || acc.account_type === 'loan'
      );
      return credits;
      */
    },
  });
};
