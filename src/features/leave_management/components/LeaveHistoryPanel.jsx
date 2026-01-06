// src/features/leave/components/LeaveHistoryPanel.jsx
import { useState } from "react";
import {
  Calendar,
  Paperclip,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react";

function ActionDropdown({ onApprove, onReject, attachmentUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded hover:bg-gray-100  text-gray-600 transition-colors"
      >
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 bg-white shadow-xl border border-gray-100 rounded-lg overflow-hidden z-20 w-40">
          <button
            onClick={() => {
              onApprove();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors"
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button
            onClick={() => {
              onReject();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
          >
            <XCircle size={16} />
            Reject
          </button>
          {attachmentUrl && (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
            >
              <Paperclip size={16} />
              View Attachment
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeaveHistoryPanel({
  applications,
  loading,
  onApprove,
  onReject,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading applications...</span>
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No Applications Yet
          </h3>
          <p className="text-sm text-gray-500">
            Leave applications will appear here once employees submit them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg">Leave Applications</h3>
        <p className="text-xs text-gray-500 mt-1">
          Review and manage employee leave requests
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Type & Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-800">
                    {app.employees?.full_name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {app.employees?.department}
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  <div className="text-xs">
                    {new Date(app.start_date).toLocaleDateString()} to{" "}
                    {new Date(app.end_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-800 text-xs mb-1">
                    {app.leave_plans?.name}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {app.reason}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : app.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {app.status === "pending" ? (
                    <ActionDropdown
                      onApprove={() => onApprove(app)}
                      onReject={() => onReject(app)}
                      attachmentUrl={app.attachment_url}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
