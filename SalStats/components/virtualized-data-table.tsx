'use client';

import { useState, useMemo } from 'react';
import { DashboardData } from '@/lib/calculations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VirtualizedDataTableProps {
  data: DashboardData[];
}

const COLUMNS = ['Account', 'Email', 'ES', 'Stage', 'Status', 'Owner', 'Source', 'Geography'];
const ROWS_PER_PAGE = 50;

export default function VirtualizedDataTable({ data }: VirtualizedDataTableProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedData = useMemo(() => {
    const start = currentPage * ROWS_PER_PAGE;
    return data.slice(start, start + ROWS_PER_PAGE);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Data Preview</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Showing <span className="font-medium">{paginatedData.length}</span> of{' '}
            <span className="font-medium">{data.length}</span> record
            {data.length !== 1 ? 's' : ''}
          </p>
        </div>
        {data.length > 0 && (
          <div className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded">
            Page {currentPage + 1} of {totalPages}
          </div>
        )}
      </div>

      {/* Table */}
      {data.length > 0 ? (
        <>
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/80 border-b border-border">
                  {COLUMNS.map(col => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-border/50 last:border-b-0 hover:bg-secondary/50 transition-colors ${
                      idx % 2 === 0 ? 'bg-background' : 'bg-secondary/30'
                    }`}
                  >
                    {COLUMNS.map(col => (
                      <td
                        key={col}
                        className="px-4 py-3 text-foreground text-ellipsis overflow-hidden whitespace-nowrap max-w-xs"
                        title={(row as any)[col] || '-'}
                      >
                        {(row as any)[col] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Total records: <span className="font-bold text-foreground">{data.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-2 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-xs text-foreground font-medium">
                {currentPage + 1} / {totalPages}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="p-2 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="border border-border rounded-lg p-8 flex items-center justify-center min-h-96">
          <p className="text-muted-foreground text-center">
            No data to display. Try adjusting your filters or uploading a CSV file.
          </p>
        </div>
      )}
    </div>
  );
}
