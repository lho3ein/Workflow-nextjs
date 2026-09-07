import React from "react";
import Badge from "./Badge";
import {
  workflowStatusLabels,
  stepStatusLabels,
  taskStatusLabels,
  taskPriorityLabels,
  priorityNumberLabels,
} from "@/types";
import { WorkflowStatus, StepStatus, TaskStatus, TaskPriority } from "@prisma/client";

export function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  const map: Record<WorkflowStatus, { tone: "green" | "gray" | "purple"; icon: string }> = {
    active: { tone: "green", icon: "fa-solid fa-circle-check" },
    inactive: { tone: "gray", icon: "fa-solid fa-circle-minus" },
    archived: { tone: "purple", icon: "fa-solid fa-box-archive" },
  };
  const c = map[status];
  return (
    <Badge tone={c.tone}>
      <i className={c.icon} />
      {workflowStatusLabels[status]}
    </Badge>
  );
}

export function StepStatusBadge({ status }: { status: StepStatus }) {
  const map: Record<StepStatus, { tone: "amber" | "blue" | "green" | "red"; icon: string }> = {
    pending: { tone: "amber", icon: "fa-solid fa-clock" },
    in_progress: { tone: "blue", icon: "fa-solid fa-spinner" },
    completed: { tone: "green", icon: "fa-solid fa-circle-check" },
    rejected: { tone: "red", icon: "fa-solid fa-circle-xmark" },
  };
  const c = map[status];
  return (
    <Badge tone={c.tone}>
      <i className={c.icon} />
      {stepStatusLabels[status]}
    </Badge>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { tone: "amber" | "blue" | "green" | "red" | "gray"; icon: string }> = {
    pending: { tone: "amber", icon: "fa-solid fa-clock" },
    in_progress: { tone: "blue", icon: "fa-solid fa-spinner" },
    completed: { tone: "green", icon: "fa-solid fa-circle-check" },
    rejected: { tone: "red", icon: "fa-solid fa-circle-xmark" },
    on_hold: { tone: "gray", icon: "fa-solid fa-pause" },
  };
  const c = map[status];
  return (
    <Badge tone={c.tone}>
      <i className={c.icon} />
      {taskStatusLabels[status]}
    </Badge>
  );
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const map: Record<TaskPriority, { tone: "gray" | "blue" | "amber" | "red"; icon: string }> = {
    low: { tone: "gray", icon: "fa-solid fa-arrow-down" },
    medium: { tone: "blue", icon: "fa-solid fa-minus" },
    high: { tone: "amber", icon: "fa-solid fa-arrow-up" },
    critical: { tone: "red", icon: "fa-solid fa-bolt" },
  };
  const c = map[priority];
  return (
    <Badge tone={c.tone}>
      <i className={c.icon} />
      {taskPriorityLabels[priority]}
    </Badge>
  );
}

export function WorkflowPriorityBadge({ priority }: { priority: number }) {
  const map: Record<number, { tone: "gray" | "blue" | "amber" | "red"; icon: string }> = {
    1: { tone: "gray", icon: "fa-solid fa-arrow-down" },
    2: { tone: "blue", icon: "fa-solid fa-minus" },
    3: { tone: "amber", icon: "fa-solid fa-arrow-up" },
    4: { tone: "red", icon: "fa-solid fa-bolt" },
  };
  const fallback: { tone: "gray" | "blue" | "amber" | "red"; icon: string } = {
    tone: "gray",
    icon: "fa-solid fa-minus",
  };
  const c = map[priority] ?? fallback;
  return (
    <Badge tone={c.tone}>
      <i className={c.icon} />
      {priorityNumberLabels[priority] ?? priority}
    </Badge>
  );
}