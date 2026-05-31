import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import { Icon } from '../Icon'

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  isLoading?: boolean
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  sorting,
  onSortingChange,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      if (onSortingChange) {
        const nextSorting = typeof updater === 'function' ? updater(sorting || []) : updater
        onSortingChange(nextSorting)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  })

  return (
    <div className="table-responsive">
      <table className="table table-vcenter card-table table-hover">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={
                    header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined
                  }
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  <div className="d-flex align-items-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && (
                      <Icon icon="chevron-up" size={14} className="ms-1" />
                    )}
                    {header.column.getIsSorted() === 'desc' && (
                      <Icon icon="chevron-down" size={14} className="ms-1" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                Memuat data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                Data tidak ditemukan.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
