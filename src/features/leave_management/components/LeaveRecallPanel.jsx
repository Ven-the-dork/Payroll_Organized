// src/features/leave/components/LeaveRecallPanel.jsx
import { Calendar, AlertCircle } from "lucide-react";

export default function LeaveRecallPanel({
  ongoingLeaves,
  loading,
  onOpenRecall,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <AlertCircle size={18} className="text-orange-500" /> Ongoing
          Recallable Leaves
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="p-5">Employee</th>
              <th className="p-5">Date Range</th>
              <th className="p-5">Reason</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : ongoingLeaves.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  No recallable leaves currently active.
                </td>
              </tr>
            ) : (
              ongoingLeaves.map((leave) => (
                <tr
                  key={leave.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-5">
                    <div className="font-bold text-gray-800 text-sm">
                      {leave.employees?.full_name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {leave.employees?.department}
                    </div>
                  </td>
                  <td className="p-5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} /> {leave.start_date} →{" "}
                      {leave.end_date}
                    </div>
                  </td>
                  <td className="p-5 text-sm text-gray-600 italic">
                    "{leave.reason}"
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => onOpenRecall(leave)}
                      className="px-4 py-1.5 bg-orange-600 cursor-pointer text-white text-xs font-bold rounded-full hover:bg-orange-700 shadow-sm transition"
                    >
                      Recall Now
                    </button>
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
