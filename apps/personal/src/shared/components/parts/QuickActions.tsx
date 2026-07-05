import { Icon } from '../ui/Icon'
import { clsx } from 'clsx'
import { useTransactionModalStore } from '@/features/transaction/store/useTransactionModalStore'
import type { Transaction } from '@/features/transaction/types/transaction.types'

export function QuickActions() {
  const { openForm } = useTransactionModalStore()

  const actions = [
    { label: 'Income', icon: 'arrow-down-left', type: 'income' },
    { label: 'Expense', icon: 'arrow-up-right', type: 'expense' },
    { label: 'Transfer', icon: 'arrows-exchange', type: 'transfer' },
  ]

  return (
    <div className="card border-0 bg-primary mb-0">
      <div className="card-body p-1">
        <div className="row g-0">
          {actions.map((a, i) => (
            <div
              key={i}
              className={clsx(
                'col text-center py-1',
                i < actions.length - 1 && 'border-end border-white-50'
              )}
            >
              <div
                onClick={() => {
                  if (a.type) {
                    openForm({ type: a.type } as unknown as Transaction)
                  }
                }}
                style={{ cursor: 'pointer', textDecoration: 'none' }}
                className="d-flex flex-column align-items-center text-white w-100"
              >
                <div className="mb-0">
                  <Icon icon={a.icon} color="white" size="sm" />
                </div>
                <div
                  className="subheader text-white fw-bold"
                  style={{ fontSize: '0.6rem', textTransform: 'none' }}
                >
                  {a.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
