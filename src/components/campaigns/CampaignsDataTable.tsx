import React, { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown,
  Search,
  Facebook,
  Chrome,
  Zap
} from 'lucide-react'
import type { CampaignData } from '@/lib/dashboard/actions'

interface CampaignsDataTableProps {
  data: CampaignData[]
  isLoading?: boolean
}

const columnHelper = createColumnHelper<CampaignData>()

// Função para renderizar badge de plataforma
const PlatformBadge = ({ platform }: { platform: string }) => {
  const config = {
    'Meta Ads': { icon: Facebook, color: 'bg-blue-100 text-blue-800', iconColor: 'text-blue-600' },
    'Google Ads': { icon: Chrome, color: 'bg-green-100 text-green-800', iconColor: 'text-green-600' },
    'TikTok Ads': { icon: Zap, color: 'bg-purple-100 text-purple-800', iconColor: 'text-purple-600' }
  }

  const { icon: Icon, color, iconColor } = config[platform as keyof typeof config]

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className={`w-3 h-3 mr-1 ${iconColor}`} />
      {platform}
    </span>
  )
}

// Função para renderizar badge de status
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    'Ativa': 'bg-green-100 text-green-800',
    'Pausada': 'bg-yellow-100 text-yellow-800',
    'Concluída': 'bg-gray-100 text-gray-800',
    'Rascunho': 'bg-blue-100 text-blue-800'
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config[status as keyof typeof config]}`}>
      {status}
    </span>
  )
}

// Definição das colunas
export const campaignColumns = [
  columnHelper.accessor('name', {
    header: 'Campanha',
    cell: (info) => (
      <div className="space-y-1">
        <div className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
          {info.getValue()}
        </div>
        <PlatformBadge platform={info.row.original.platform} />
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('roas', {
    header: 'ROAS',
    cell: (info) => {
      const value = info.getValue()
      return value ? `${value.toFixed(2)}x` : '-'
    },
  }),
  columnHelper.accessor('cpa', {
    header: 'CPA',
    cell: (info) => {
      const value = info.getValue()
      return value ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value) : '-'
    },
  }),
  columnHelper.accessor('spend', {
    header: 'Gasto',
    cell: (info) => {
      const value = info.getValue()
      return value ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value) : '-'
    },
  }),
  columnHelper.accessor('impressions', {
    header: 'Impressões',
    cell: (info) => {
      const value = info.getValue()
      return value ? new Intl.NumberFormat('pt-BR').format(value) : '-'
    },
  }),
  columnHelper.accessor('clicks', {
    header: 'Cliques',
    cell: (info) => {
      const value = info.getValue()
      return value ? new Intl.NumberFormat('pt-BR').format(value) : '-'
    },
  }),
  columnHelper.accessor('conversions', {
    header: 'Conversões',
    cell: (info) => {
      const value = info.getValue()
      return value ? new Intl.NumberFormat('pt-BR').format(value) : '-'
    },
  }),
  columnHelper.accessor('sessions_ga4', {
    header: 'Sessões GA4',
    cell: (info) => {
      const value = info.getValue()
      return value ? new Intl.NumberFormat('pt-BR').format(value) : '-'
    },
  }),
]

export default function CampaignsDataTable({
  data,
  isLoading = false
}: CampaignsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns: campaignColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4 mb-4">
              {[...Array(9)].map((_, j) => (
                <div key={j} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
      {/* Header com filtro */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Campanhas
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar campanhas..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={campaignColumns.length}
                  className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p>Nenhuma campanha encontrada</p>
                    <p className="text-sm mt-1">Tente ajustar os filtros ou adicionar novas campanhas</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} por página
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 