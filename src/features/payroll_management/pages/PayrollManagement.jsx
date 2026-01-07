// src/pages/admin/payroll/PayrollManagement.jsx
import { useState, useEffect, useMemo } from "react";
import { Menu, Settings, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

import AdminBell from "../../../components/AdminBell";
import AdminSidebar from "../components/Payrolldashvar";
import FontSizeMenu from "../../../components/hooks/FontSizeMenu";
import AdminSetting from "../../../components/Adminsetting";

import {
  fetchActiveEmployeesForPayroll,
  fetchAttendanceCounts,
  updateEmployeeDailyRate,
  upsertPayrollRun,
  upsertPayrollRecords,
} from "../../../services/payrollService";

import PayrollConfigCard from "../components/PayrollConfigCard";
import PayrollStatsCards from "../components/PayrollStatsCards";
import PayrollTable from "../components/PayrollTable";

export default function PayrollManagement() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState("2025-12-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const [employees, setEmployees] = useState([]);
  const [attendanceCounts, setAttendanceCounts] = useState({});
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const [savingRateById, setSavingRateById] = useState({});
  const [rateErrorById, setRateErrorById] = useState({});

  const [processing, setProcessing] = useState(false);
  const [processMsg, setProcessMsg] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  const peso = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
      : "₱0.00";

  const setSavingFor = (id, val) =>
    setSavingRateById((prev) => ({ ...prev, [id]: val }));
  const setRateErrorFor = (id, msg) =>
    setRateErrorById((prev) => ({ ...prev, [id]: msg }));

  // 1) Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const data = await fetchActiveEmployeesForPayroll();
        setEmployees(data);
      } catch (error) {
        console.error("Load employees error:", error);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    loadEmployees();
  }, []);

  // 2) Load attendance counts
  useEffect(() => {
    const loadAttendanceCounts = async () => {
      if (!startDate || !endDate) return;
      setLoadingAttendance(true);
      try {
        const counts = await fetchAttendanceCounts(startDate, endDate);
        setAttendanceCounts(counts);
      } catch (error) {
        console.error(error);
        setAttendanceCounts({});
      } finally {
        setLoadingAttendance(false);
      }
    };
    loadAttendanceCounts();
  }, [startDate, endDate]);

  const filteredEmployees = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) => {
      const name = (e.full_name || "").toLowerCase();
      const dept = (e.department || "").toLowerCase();
      const pos = (e.position || "").toLowerCase();
      return name.includes(q) || dept.includes(q) || pos.includes(q);
    });
  }, [employees, searchTerm]);

  const toggleRow = (employeeId) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((x) => x !== employeeId)
        : [...prev, employeeId]
    );
  };

  const visibleIds = filteredEmployees.map((e) => e.id);
  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedEmployeeIds.includes(id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelectedEmployeeIds((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedEmployeeIds((prev) =>
        Array.from(new Set([...prev, ...visibleIds]))
      );
    }
  };

  const handleRateChange = (employeeId, value) => {
    setRateErrorFor(employeeId, "");
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId ? { ...e, daily_rate: value } : e
      )
    );
  };

  const saveRate = async (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;
    const rateNum = Number(emp.daily_rate);
    if (!Number.isFinite(rateNum) || rateNum < 0) {
      setRateErrorFor(employeeId, "Invalid rate");
      return;
    }
    setSavingFor(employeeId, true);
    setRateErrorFor(employeeId, "");
    try {
      await updateEmployeeDailyRate(employeeId, rateNum);
    } catch (err) {
      setRateErrorFor(employeeId, err?.message || "Failed to save");
    } finally {
      setSavingFor(employeeId, false);
    }
  };

  const rowsWithPreview = useMemo(() => {
    return filteredEmployees.map((e) => {
      const presentDays = attendanceCounts[e.id] || 0;
      const rate = Number(e.daily_rate) || 0;
      const grossPay = presentDays * rate;
      return { ...e, presentDays, grossPay };
    });
  }, [filteredEmployees, attendanceCounts]);

  const totalGross = useMemo(
    () =>
      rowsWithPreview
        .filter((r) => selectedEmployeeIds.includes(r.id))
        .reduce((sum, r) => sum + (Number(r.grossPay) || 0), 0),
    [rowsWithPreview, selectedEmployeeIds]
  );

  const handleProcessPayroll = async () => {
    if (processing) return;
    setProcessMsg("");
    if (!startDate || !endDate)
      return setProcessMsg("Please select dates.");
    if (selectedEmployeeIds.length === 0)
      return setProcessMsg("Select at least 1 employee.");

    setProcessing(true);
    try {
      const runId = await upsertPayrollRun(startDate, endDate);

      const records = rowsWithPreview
        .filter((r) => selectedEmployeeIds.includes(r.id))
        .map((r) => ({
          employee_id: r.id,
          period_start: startDate,
          period_end: endDate,
          gross_pay: Number(r.grossPay) || 0,
          status: "Paid",
          paid_at: new Date().toISOString(),
        }));

      await upsertPayrollRecords(records);

      setProcessMsg(`Success! Run ID: ${runId ?? "N/A"}`);
      setSelectedEmployeeIds([]);
    } catch (err) {
      console.error(err);
      setProcessMsg(err?.message || "Failed.");
    } finally {
      setProcessing(false);
    }
  };

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-800">
      <AdminSidebar
        isOpen={isOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={(path) => navigate(path)}
      />

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "lg:ml-0" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Payroll Processing
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Calculate and disperse employee salaries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-xs text-gray-400 font-medium">
              Last updated: {currentTime}
            </span>
            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />
            <AdminBell />
            <AdminSetting
              trigger={
                <button className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 flex items-center justify-center">
                  <Settings size={20} />
                </button>
              }
            >
              {({ close }) => <FontSizeMenu closeMenu={close} />}
            </AdminSetting>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <PayrollConfigCard
            startDate={startDate}
            endDate={endDate}
            onChangeStart={setStartDate}
            onChangeEnd={setEndDate}
            loadingAttendance={loadingAttendance}
            processMsg={processMsg}
          />

          <PayrollStatsCards
            selectedCount={selectedEmployeeIds.length}
            totalGross={totalGross}
            peso={peso}
          />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <PayrollTable
              searchTerm={searchTerm}
              onChangeSearch={setSearchTerm}
              loadingEmployees={loadingEmployees}
              rowsWithPreview={rowsWithPreview}
              attendanceCounts={attendanceCounts}
              selectedEmployeeIds={selectedEmployeeIds}
              onToggleRow={toggleRow}
              onToggleAll={toggleAll}
              allVisibleSelected={allVisibleSelected}
              rateErrorById={rateErrorById}
              onRateChange={handleRateChange}
              onSaveRate={saveRate}
              peso={peso}
            />

            {/* Sticky Footer Action Bar */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-bold text-gray-800">
                  {selectedEmployeeIds.length}
                </span>{" "}
                employees selected for processing
              </div>
              <button
                onClick={handleProcessPayroll}
                disabled={selectedEmployeeIds.length === 0 || processing}
                className="flex items-center cursor-pointer gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-green-200 transition-all transform active:scale-95"
              >
                {processing ? "Processing..." : "Process Payroll"}{" "}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
