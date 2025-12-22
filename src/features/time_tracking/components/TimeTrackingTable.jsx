// src/pages/admin/timetracking/components/TimeTrackingTable.jsx
export default function TimeTrackingTable({ loading, rows }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">
                Employee
              </th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">
                Department
              </th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">
                Date
              </th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">
                Clock In
              </th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-400"
                >
                  Loading attendance...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {row.employee}
                  </td>
                  <td className="p-4 text-gray-600">
                    {row.department}
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-xs">
                    {row.date}
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-xs">
                    {row.clockIn}
                  </td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        row.status === "Present"
                          ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                          : row.status === "Late"
                          ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
                          : row.status === "On Leave"
                          ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20"
                          : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "Present"
                            ? "bg-green-600"
                            : row.status === "Late"
                            ? "bg-yellow-500"
                            : row.status === "On Leave"
                            ? "bg-purple-600"
                            : "bg-red-600"
                        }`}
                      />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
