// src/pages/admin/timetracking/components/TimeTrackingFilters.jsx
import { CalendarDays, Briefcase, Filter, Search, Download } from "lucide-react";

export default function TimeTrackingFilters({
  selectedDate,
  onChangeDate,
  selectedDepartment,
  onChangeDepartment,
  selectedStatus,
  onChangeStatus,
  searchTerm,
  onChangeSearch,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <label className="space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <CalendarDays size={12} /> Date
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <Briefcase size={12} /> Department
          </span>
          <select
            value={selectedDepartment}
            onChange={(e) => onChangeDepartment(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="All">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <Filter size={12} /> Status
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => onChangeStatus(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="On Leave">On Leave</option>
            <option value="Absent">Absent</option>
          </select>
        </label>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
