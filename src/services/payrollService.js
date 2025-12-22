// src/services/payrollService.js
import { supabase } from "../supabaseClient";

// Admin: list active employees for payroll processing
export async function fetchActiveEmployeesForPayroll() {
  const { data, error } = await supabase
    .from("employees")
    .select("id, full_name, department, position, daily_rate")
    .eq("status", "Active")
    .eq("is_disabled", false)   // hide soft-deleted
    .neq("role", "admin");
  if (error) throw error;
  return data || [];
}

// Admin: attendance summary per employee for a period
export async function fetchAttendanceCounts(startDate, endDate) {
  const { data, error } = await supabase
    .from("attendance_logs")
    .select("employee_id, shift_date")
    .gte("shift_date", startDate)
    .lte("shift_date", endDate)
    .not("clock_in_at", "is", null);

  if (error) throw error;

  const counts = {};
  for (const row of data || []) {
    const key = row.employee_id;
    const day = row.shift_date;
    if (!counts[key]) counts[key] = new Set();
    counts[key].add(day);
  }

  const normalized = {};
  Object.keys(counts).forEach((k) => {
    normalized[k] = counts[k].size;
  });
  return normalized;
}

// Admin: update daily rate inline in payroll screen
export async function updateEmployeeDailyRate(employeeId, rateNum) {
  const { error } = await supabase
    .from("employees")
    .update({ daily_rate: rateNum })
    .eq("id", employeeId);

  if (error) throw error;
}

// Admin: create or reuse a payroll run id for a period
export async function upsertPayrollRun(startDate, endDate) {
  const { data: insertedRun, error: runInsertErr } = await supabase
    .from("payroll_runs")
    .insert([{ period_start: startDate, period_end: endDate }])
    .select("id")
    .maybeSingle();

  if (!runInsertErr && insertedRun?.id) return insertedRun.id;

  // if insert failed (likely duplicate), try to find existing
  const { data: existingRun } = await supabase
    .from("payroll_runs")
    .select("id")
    .eq("period_start", startDate)
    .eq("period_end", endDate)
    .maybeSingle();

  return existingRun?.id ?? null;
}

// Admin: upsert payroll records per employee
export async function upsertPayrollRecords(records) {
  const { error } = await supabase
    .from("payroll_records")
    .upsert(records, { onConflict: "employee_id,period_start,period_end" });

  if (error) throw error;
}

// User dashboard: fetch payroll history for a single employee
export async function fetchPayrollHistoryByEmployee(employeeId, limit = 24) {
  const { data, error } = await supabase
    .from("payroll_records")
    .select("*")
    .eq("employee_id", employeeId)
    .order("period_end", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
