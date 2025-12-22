// src/services/employeeService.js
import { supabase } from "../supabaseClient";

const ACTIVE_THRESHOLD_MS = 30_000;

function mapRowToEmployee(row) {
  const lastSeen = row.last_seen ? new Date(row.last_seen) : null;
  const isRecent =
    lastSeen && Date.now() - lastSeen.getTime() < ACTIVE_THRESHOLD_MS;

  return {
    id: row.id,
    firebaseUid: row.firebase_uid,
    name: row.full_name || "Unknown",
    email: row.email || "",
    department: row.department || "N/A",
    position: row.position || "N/A",
    startDate: row.start_date || "N/A",
    category: row.category || "N/A",
    gender: row.gender || "N/A",
    status: isRecent ? "Active" : "Inactive",
    contact: row.contact || "",
    address: row.address || "",
    profile_image_url: row.profile_image_url || "",
    role: row.role || "user",
    can_view_payroll: row.can_view_payroll || false,
  };
}

export async function fetchEmployees({ searchTerm, sortField, sortDirection }) {
  let query = supabase
    .from("employees")
    .select("*")
    .neq("role", "admin")
    .order(sortField, { ascending: sortDirection === "asc" });

  if (searchTerm.trim()) {
    const term = `%${searchTerm.trim()}%`;
    query = query.or(
      `full_name.ilike.${term},department.ilike.${term},position.ilike.${term}`
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(mapRowToEmployee);
}

export async function insertEmployee(employeePayload) {
  const { error } = await supabase.from("employees").insert(employeePayload);
  if (error) throw error;
}

export async function deleteEmployeeById(id) {
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) throw error;
}

// Full profile for auth flows (employee + admin)
export async function fetchEmployeeByFirebaseUid(firebaseUid) {
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, firebase_uid, role, email, full_name, department, position, can_view_payroll"
    )
    .eq("firebase_uid", firebaseUid)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

// Resolve just the employee id from Firebase uid (DashboardUser fallback)
export async function fetchEmployeeIdByFirebaseUid(uid) {
  const { data, error } = await supabase
    .from("employees")
    .select("id")
    .eq("firebase_uid", uid)
    .single();

  if (error) throw error;
  return data?.id ?? null;
}

// Heartbeat helpers (DashboardUser)
export async function markEmployeeOnline(employeeId) {
  const { error } = await supabase
    .from("employees")
    .update({
      status: "Active",
      last_seen: new Date().toISOString(),
    })
    .eq("id", employeeId);

  if (error) throw error;
}

export async function markEmployeeOffline(employeeId) {
  const { error } = await supabase
    .from("employees")
    .update({ status: "Inactive" })
    .eq("id", employeeId);

  if (error) throw error;
}
