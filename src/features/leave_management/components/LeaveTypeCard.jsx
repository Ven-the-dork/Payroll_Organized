// src/features/leave/components/LeaveTypeCard.jsx
import { FileText, DollarSign, Ban } from "lucide-react";

export default function LeaveTypeCard({ days, label, remaining, isPaid, onApply }) {
  const balance = remaining !== undefined ? remaining : days;
  const isExhausted = balance === 0;

  return (
    <div className="relative bg-gradient-to-br from-green-700 to-green-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Top Section: Icon + Status + Paid/Unpaid Badge */}
      <div className="flex items-start justify-between mb-6">
        {/* Icon + Available Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <FileText className="text-green-800" size={20} />
          </div>
          <span className="text-white text-sm font-semibold uppercase tracking-wide">
            {isExhausted ? "EXHAUSTED" : "AVAILABLE"}
          </span>
        </div>

        {/* Paid/Unpaid Badge */}
        <div className="flex items-center gap-1">
          {isPaid ? (
            <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              <DollarSign size={12} />
              <span>PAID</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              <Ban size={12} />
              <span>UNPAID</span>
            </div>
          )}
        </div>
      </div>

      {/* Days Remaining */}
      <div className="mb-4">
        <div className="text-5xl font-extrabold text-white leading-none">
          {balance}
        </div>
        <p className="text-white/80 text-sm font-medium mt-1">days remaining</p>
      </div>

      {/* Leave Type Label */}
      <h3 className="text-white text-lg font-bold mb-6">{label}</h3>

      {/* Apply Button */}
      <button
        onClick={onApply}
        disabled={isExhausted}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
          isExhausted
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-yellow-400 text-green-900 hover:bg-yellow-300 active:scale-95"
        }`}
      >
        {isExhausted ? "No Balance" : "Apply Now"}
      </button>
    </div>
  );
}
