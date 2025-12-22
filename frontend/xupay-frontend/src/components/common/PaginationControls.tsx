'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  isLoading?: boolean
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  isLoading = false,
}: PaginationControlsProps) {
  const canPrevious = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
      {/* Page Size Selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Show:
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={isLoading}
            className="px-3 py-1 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white disabled:opacity-50"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Page Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> of{' '}
        <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={canPrevious ? { scale: 1.05 } : {}}
          whileTap={canPrevious ? { scale: 0.95 } : {}}
          onClick={() => canPrevious && onPageChange(currentPage - 1)}
          disabled={!canPrevious || isLoading}
          className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <motion.button
          whileHover={canNext ? { scale: 1.05 } : {}}
          whileTap={canNext ? { scale: 0.95 } : {}}
          onClick={() => canNext && onPageChange(currentPage + 1)}
          disabled={!canNext || isLoading}
          className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>
    </div>
  )
}
