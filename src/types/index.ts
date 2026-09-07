import { Role, WorkflowStatus, StepStatus, TaskStatus, TaskPriority } from "@prisma/client";

export interface SessionUser {
   id: string;
   name?: string | null;
   email?: string | null;
   role: Role;
   departmentId?: number | null;
}

export interface DashboardStats {
   totalDepartments: number;
   totalWorkflows: number;
   totalTasks: number;
   pendingTasks: number;
   inProgressTasks: number;
   completedTasks: number;
}

export interface SelectOption {
   value: string;
   label: string;
}

export const workflowStatusLabels: Record<WorkflowStatus, string> = {
   active: "فعال",
   inactive: "غیرفعال",
   archived: "آرشیو شده",
};

export const stepStatusLabels: Record<StepStatus, string> = {
   pending: "در انتظار",
   in_progress: "در حال انجام",
   completed: "تکمیل شده",
   rejected: "رد شده",
};

export const taskStatusLabels: Record<TaskStatus, string> = {
   pending: "در انتظار",
   in_progress: "در حال انجام",
   completed: "تکمیل شده",
   rejected: "رد شده",
   on_hold: "متوقف",
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
   low: "کم",
   medium: "متوسط",
   high: "زیاد",
   critical: "بحرانی",
};

export const priorityNumberLabels: Record<number, string> = {
   1: "کم",
   2: "متوسط",
   3: "زیاد",
   4: "بحرانی",
};
