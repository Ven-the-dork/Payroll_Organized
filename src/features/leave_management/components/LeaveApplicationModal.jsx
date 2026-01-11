// src/features/leave/components/LeaveApplicationModal.jsx
import { X, Paperclip, FileText, DollarSign, Ban, AlertCircle } from "lucide-react";

// ✅ UPDATED: Match payroll logic (only Sunday excluded)
function calculateDuration(start, end) {
  if (!start || !end) return 0;
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (endDate < startDate) return 0;

  let count = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const day = currentDate.getDay();
    // ✅ Only exclude Sunday (0), count Saturday (6)
    if (day !== 0) count++;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
}

export default function LeaveApplicationModal({
  onClose,
  leaveType,
  remainingBalance,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  reason,
  setReason,
  attachment,
  setAttachment,
  onSubmit,
  submitting,
}) {
  const requestedDays = calculateDuration(startDate, endDate);
  
  // ✅ NEW: Validation states
  const hasDateError = startDate && endDate && requestedDays === 0;
  const exceedsBalance = requestedDays > remainingBalance; // ✅ FIXED: No space!
  const canSubmit = 
    startDate && 
    endDate && 
    reason.trim() && 
    requestedDays > 0 && // ✅ Must have at least 1 working day
    requestedDays <= remainingBalance &&
    !submitting;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Apply for {leaveType?.name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500">
                Available: <span className="font-semibold text-gray-900">{remainingBalance} days</span>
              </p>
              {/* Paid/Unpaid Badge */}
              {leaveType?.is_paid ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <DollarSign size={12} />
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  <Ban size={12} />
                  Unpaid
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* ✅ NEW: Error Messages */}
          {hasDateError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Invalid Date Range</p>
                <p className="text-sm text-red-700 mt-1">
                  Your selected dates only include Sundays (non-working days). 
                  Please select dates that include at least one working day (Monday-Saturday).
                </p>
              </div>
            </div>
          )}

          {exceedsBalance && requestedDays > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Insufficient Balance</p>
                <p className="text-sm text-red-700 mt-1">
                  You're requesting {requestedDays} days but only have {remainingBalance} days available.
                </p>
              </div>
            </div>
          )}

          {/* Duration Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Requested Duration</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sundays are automatically excluded
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  hasDateError ? 'text-red-600' : 
                  exceedsBalance ? 'text-red-600' : 
                  'text-blue-600'
                }`}>
                  {requestedDays}
                </p>
                <p className="text-xs text-gray-500">working days</p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              placeholder="Please provide a detailed reason for your leave request..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Attachment (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Document (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <Paperclip size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {attachment ? attachment.name : "Click to attach a file"}
                </span>
                <input
                  type="file"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </label>
              {attachment && (
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
