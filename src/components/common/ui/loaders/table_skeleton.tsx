import { Skeleton } from 'antd';

interface TableSkeletonColumn {
  width?: string; // For flex-based: "40px", "12%", etc. For regular: undefined
  isCheckbox?: boolean; // If true, shows checkbox skeleton
}

interface TableSkeletonProps {
  columns: TableSkeletonColumn[];
  rowCount?: number; // Number of skeleton rows (default: 5)
  hasCheckbox?: boolean; // Whether to include checkbox column
  isTableFixed?: boolean; // Whether using table-fixed layout (default: false)
  minWidth?: string; // Minimum width for scrollable tables (e.g., "800px")
}

/**
 * Reusable Table Skeleton Component
 * Displays skeleton loading state for tables
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rowCount = 5,
  hasCheckbox = false,
  isTableFixed = false,
  minWidth,
}) => {
  const tableClassName = isTableFixed ? 'w-full table-fixed' : 'w-full';
  const trClassName = isTableFixed ? 'flex h-[48px]' : '';
  const minWidthStyle = minWidth ? { minWidth } : {};

  return (
    <div className="flex flex-col h-full min-h-0 bg-(--color-bg-card) rounded-lg shadow-sm border border-(--color-border) overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-(--color-border) bg-(--color-bg-secondary)">
        <table className={tableClassName} style={minWidthStyle}>
          <thead>
            <tr className={trClassName}>
              {hasCheckbox && (
                <th className={`px-4 py-3 ${isTableFixed ? 'flex-[0_0_40px] flex items-center' : ''}`}>
                  <Skeleton.Button active size="small" style={{ width: 16, height: 16 }} />
                </th>
              )}
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left ${
                    isTableFixed && col.width
                      ? `flex-[0_0_${col.width}] flex items-center`
                      : ''
                  }`}
                >
                  {col.isCheckbox ? (
                    <Skeleton.Button active size="small" style={{ width: 16, height: 16 }} />
                  ) : (
                    <Skeleton.Input active size="small" style={{ width: col.width || '80%' }} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Body with skeleton rows */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <table className={tableClassName} style={minWidthStyle}>
          <tbody className={isTableFixed ? 'block' : ''}>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-(--color-border) ${isTableFixed ? 'flex' : ''}`}
              >
                {hasCheckbox && (
                  <td className={`px-4 py-3 ${isTableFixed ? 'flex-[0_0_40px] flex items-center' : ''}`}>
                    <Skeleton.Button active size="small" style={{ width: 16, height: 16 }} />
                  </td>
                )}
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-3 ${
                      isTableFixed && col.width ? `flex-[0_0_${col.width}]` : ''
                    }`}
                  >
                    {col.isCheckbox ? (
                      <Skeleton.Button active size="small" style={{ width: 16, height: 16 }} />
                    ) : (
                      <Skeleton.Input
                        active
                        size="small"
                        style={{
                          width: col.width && !isTableFixed ? col.width : '80%',
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

