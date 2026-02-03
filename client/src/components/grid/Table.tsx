import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  mobileCardRender?: (row: T) => React.ReactNode;
  keyExtractor: (row: T) => string | number;
}

export function Table<T>({ 
  data, 
  columns, 
  onRowClick, 
  mobileCardRender,
  keyExtractor 
}: TableProps<T>) {
  
  // Helper to render cell content
  const renderCell = (row: T, column: Column<T>) => {
    if (column.render) {
      return column.render(row);
    }
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return (row[column.accessor] as unknown) as React.ReactNode;
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-widest font-black text-slate-500">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`p-4 font-semibold ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {data.map((row) => (
              <tr 
                key={keyExtractor(row)} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`group transition-colors duration-200 hover:bg-brand-primary/5 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, index) => (
                  <td 
                    key={index} 
                    className={`p-4 text-sm text-slate-700 font-medium ${col.className || ''}`}
                  >
                    {renderCell(row, col)}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
                <tr>
                    <td colSpan={columns.length} className="p-8 text-center text-text-muted text-sm">
                        No data available
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <div 
            key={keyExtractor(row)}
            onClick={() => onRowClick && onRowClick(row)}
            className={`p-5 rounded-2xl border border-slate-100 bg-white shadow-sm ${onRowClick ? 'active:scale-[0.99] transition-transform' : ''}`}
          >
            {mobileCardRender ? (
              mobileCardRender(row)
            ) : (
                // Default Mobile Render: Stacked Key-Value pairs
              <div className="space-y-3">
                {columns.map((col, index) => (
                  <div key={index} className="flex flex-col space-y-1">
                    <span className="text-xs uppercase tracking-widest text-slate-400 font-black">
                      {col.header}
                    </span>
                    <span className="text-sm text-slate-800 font-semibold">
                      {renderCell(row, col)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
         {data.length === 0 && (
            <div className="p-8 text-center text-text-muted text-sm border border-border-base rounded-xl border-dashed">
                No data available
            </div>
        )}
      </div>
    </div>
  );
}
