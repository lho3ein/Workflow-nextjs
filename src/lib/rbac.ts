import { Role } from "@prisma/client";

const roleHierarchy: Record<Role, number> = {
  admin: 4,
  manager: 3,
  supervisor: 2,
  user: 1,
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function isAdmin(role: Role): boolean {
  return role === "admin";
}

export function isManager(role: Role): boolean {
  return hasRole(role, "manager");
}

export function isSupervisor(role: Role): boolean {
  return hasRole(role, "supervisor");
}

export function canManageDepartments(role: Role): boolean {
  return isManager(role);
}

export function canManageWorkflows(role: Role): boolean {
  return isSupervisor(role);
}

export function canManageTasks(role: Role): boolean {
  return isSupervisor(role);
}

export function canViewAll(role: Role): boolean {
  return isSupervisor(role);
}

export const roleLabels: Record<Role, string> = {
  admin: "مدیر سیستم",
  manager: "مدیر دپارتمان",
  supervisor: "سرپرست",
  user: "کاربر عادی",
};