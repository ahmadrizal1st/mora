import { clsx } from 'clsx'
import type { ReactNode } from 'react'

export interface DataGridProps {
  children: ReactNode
  className?: string
}

export function DataGrid({ children, className }: DataGridProps) {
  return (
    <div className={clsx('datagrid', className)}>
      {children}
    </div>
  )
}

export interface DataGridItemProps {
  title: string
  content?: ReactNode
  children?: ReactNode
  className?: string
}

export function DataGridItem({ title, content, children, className }: DataGridItemProps) {
  return (
    <div className={clsx('datagrid-item', className)}>
      <div className="datagrid-title">{title}</div>
      <div className="datagrid-content">
        {content || children}
      </div>
    </div>
  )
}
