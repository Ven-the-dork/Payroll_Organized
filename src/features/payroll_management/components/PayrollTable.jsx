// src/pages/admin/payroll/components/PayrollTable.jsx
import { Search, CheckSquare, Square } from "lucide-react";

export default function PayrollTable({
  searchTerm,
  onChangeSearch,
  loadingEmployees,
  rowsWithPreview,
  attendanceCounts,
  selectedEmployeeIds,
  onToggleRow,
  onToggleAll,
  allVisibleSelected,
  rateErrorById,
  onRateChange,
  onSaveRate,
  peso,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="p-4 w-12 text-center">
                <button
                  onClick={onToggleAll}
                  className="text-gray-400 cursor-pointer hover:text-green-600"
                >
                  {allVisibleSelected ? (
                    <CheckSquare size={18} />
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </th>
              <th className="p-4">Employee</th>
              <th className="p-4">Dept.</th>
              <th className="p-4 text-center">Days</th>
              <th className="p-4">Daily Rate</th>
              <th className="p-4 text-right">Gross Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loadingEmployees ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  Loading directory...
                </td>
              </tr>
            ) : rowsWithPreview.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No employees match your search.
                </td>
              </tr>
            ) : (
              rowsWithPreview.map((row) => {
                const isSelected = selectedEmployeeIds.includes(row.id);
                const errMsg = rateErrorById[row.id];
                return (
                  <tr
                    key={row.id}
                    className={`group transition-colors ${
                      isSelected ? "bg-green-50/30" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onToggleRow(row.id)}
                        className={`${
                          isSelected
                            ? "text-green-600"
                            : "text-gray-300 cursor-pointer group-hover:text-gray-400"
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare size={18} />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs">
                          {row.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">
                            {row.full_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {row.position}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {row.department}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 font-bold text-xs">
                        {attendanceCounts[row.id] ?? 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative max-w-[100px]">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          ₱
                        </span>
                        <input
                          type="number"
                          value={row.daily_rate}
                          onChange={(e) =>
                            onRateChange(row.id, e.target.value)
                          }
                          onBlur={() => onSaveRate(row.id)}
                          className={`w-full pl-5 pr-2 py-1.5 rounded border text-sm font-medium focus:ring-2 outline-none ${
                            errMsg
                              ? "border-red-300 focus:ring-red-200 bg-red-50"
                              : "border-gray-200 focus:ring-green-500"
                          }`}
                        />
                      </div>
                      {errMsg && (
                        <div className="text-[10px] text-red-500 mt-1">
                          {errMsg}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right font-bold text-green-700 text-sm">
                      {peso(Number(row.grossPay) || 0)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
