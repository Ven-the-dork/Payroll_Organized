// src/features/leave/components/LeaveSettingsPanel.jsx
import { Briefcase, Settings } from "lucide-react";

export default function LeaveSettingsPanel({
  // data
  leavePlans,

  // create form state
  leavePlanName,
  durationDays,
  allowRecall,

  // edit form state
  editingPlan,
  editName,
  editDuration,
  editAllowRecall,
  openDropdown,

  // handlers
  onChangeLeavePlanName,
  onChangeDurationDays,
  onChangeAllowRecall,
  onCreate,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onChangeEditName,
  onChangeEditDuration,
  onChangeEditAllowRecall,
  onDeletePlan,
  setOpenDropdown,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create Form */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <Briefcase size={16} />
          </div>
          New Leave Type
        </h3>

        <form onSubmit={onCreate} className="space-y-4">
          <label className="block text-sm">
            <span className="text-gray-500 font-bold text-xs uppercase">
              Plan Name
            </span>
            <select
              value={leavePlanName}
              onChange={(e) => onChangeLeavePlanName(e.target.value)}
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select...</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Casual Leave">Casual Leave</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-gray-500 font-bold text-xs uppercase">
              Duration (Days)
            </span>
            <input
              type="number"
              value={durationDays}
              onChange={(e) => onChangeDurationDays(e.target.value)}
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-gray-500 font-bold text-xs uppercase">
              Allow Recall?
            </span>
            <select
              value={allowRecall}
              onChange={(e) => onChangeAllowRecall(e.target.value)}
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-green-100 mt-2"
          >
            Create Plan
          </button>
        </form>
      </div>

      {/* List / Edit Table */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Existing Leave Plans</h3>
        </div>

        {editingPlan && (
          <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-center gap-4">
            <div className="flex-1 grid grid-cols-3 gap-3">
              <input
                value={editName}
                onChange={(e) => onChangeEditName(e.target.value)}
                className="p-2 text-sm rounded border border-yellow-200"
                placeholder="Name"
              />
              <input
                value={editDuration}
                onChange={(e) => onChangeEditDuration(e.target.value)}
                className="p-2 text-sm rounded border border-yellow-200"
                type="number"
                placeholder="Days"
              />
              <select
                value={editAllowRecall}
                onChange={(e) => onChangeEditAllowRecall(e.target.value)}
                className="p-2 text-sm rounded border border-yellow-200"
              >
                <option value="Yes">Recall: Yes</option>
                <option value="No">Recall: No</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onSaveEdit}
                className="px-3 py-1.5 bg-green-700 text-white text-xs font-bold rounded"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="px-3 py-1.5 bg-white border border-gray-300 text-xs font-bold rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Plan Name</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Recallable</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leavePlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">
                    {plan.name}
                  </td>
                  <td className="p-4 text-gray-600">
                    {plan.duration_days} days
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        plan.allow_recall
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {plan.allow_recall ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-4 text-right relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === plan.id ? null : plan.id
                        )
                      }
                      className="text-gray-400 hover:text-green-700"
                    >
                      <Settings size={16} />
                    </button>

                    {openDropdown === plan.id && (
                      <div className="absolute right-8 top-2 bg-white shadow-xl border border-gray-100 rounded-lg overflow-hidden z-20 w-32">
                        <button
                          onClick={() => onStartEdit(plan)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeletePlan(plan.id)}
                          className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
