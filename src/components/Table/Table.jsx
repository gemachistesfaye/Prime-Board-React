export const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
        <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-bold tracking-wide">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/30 transition-colors duration-200"
            >
              {columns.map((col) => {
                const cellValue = row[col.toLowerCase()];

                
                if (col.toLowerCase() === 'status') {
                  const isActive = cellValue?.toLowerCase() === 'active';
                  return (
                    <td key={col} className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-400 dark:border-emerald-600'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-400 dark:border-amber-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                            isActive ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-amber-500 dark:bg-amber-400'
                          }`}
                        ></span>
                        {cellValue}
                      </span>
                    </td>
                  );
                }

                return (
                  <td key={col} className="px-4 py-3 whitespace-nowrap group-hover:text-slate-900 dark:group-hover:text-white">
                    {cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
