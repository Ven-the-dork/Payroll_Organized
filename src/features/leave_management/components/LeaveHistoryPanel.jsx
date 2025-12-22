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
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all"
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      >
        Actions <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5">
          <button
            onClick={onApprove}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle size={14} className="text-green-600" /> Approve
          </button>
          <button
            onClick={onReject}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
          >
            <XCircle size={14} className="text-red-600" /> Reject
          </button>
          {attachmentUrl && (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2 border-t border-gray-50"
            >
              <Paperclip size={14} className="text-blue-500" /> View Attachment
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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Calendar size={18} className="text-green-600" /> All Applications
        </h3>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
          {applications.length} records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="p-5">Employee</th>
              <th className="p-5">Dates</th>
              <th className="p-5">Type & Reason</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  Loading history...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No leave applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="p-5">
                    <div className="font-bold text-gray-800 text-sm">
                      {app.employees?.full_name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {app.employees?.department}
                    </div>
                  </td>
                  <td className="p-5 text-sm text-gray-600">
                    <div className="font-medium text-gray-800">
                      {new Date(app.start_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs">
                      to {new Date(app.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-5 max-w-xs">
                    <div className="text-xs font-bold text-green-700 uppercase mb-0.5">
                      {app.leave_plans?.name}
                    </div>
                    <div
                      className="text-xs text-gray-500 truncate"
                      title={app.reason}
                    >
                      {app.reason}
                    </div>
                  </td>
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        app.status === "approved"
                          ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                          : app.status === "rejected"
                          ? "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                          : app.status === "recalled"
                          ? "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20"
                          : "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          app.status === "approved"
                            ? "bg-green-600"
                            : app.status === "rejected"
                            ? "bg-red-600"
                            : app.status === "recalled"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      {app.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {app.status === "pending" ? (
                      <ActionDropdown
                        onApprove={() => onApprove(app.id)}
                        onReject={() => onReject(app.id)}
                        attachmentUrl={app.attachment_url}
                      />
                    ) : (
                      app.attachment_url && (
                        <a
                          href={app.attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 hover:underline text-xs flex items-center justify-end gap-1"
                        >
                          <Paperclip size={12} /> View File
                        </a>
                      )
                    )}
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
