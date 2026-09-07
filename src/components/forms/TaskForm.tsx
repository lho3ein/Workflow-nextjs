"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { TaskStatus, TaskPriority } from "@prisma/client";

interface WorkflowOption {
  id: number;
  title: string;
}

interface WorkflowStepOption {
  id: number;
  name: string;
  workflowId: number;
}

interface UserOption {
  id: number;
  name: string;
  email: string;
}

interface TaskFormProps {
  workflows: WorkflowOption[];
  workflowSteps: WorkflowStepOption[];
  users: UserOption[];
  initialData?: {
    id: number;
    title: string;
    description: string | null;
    workflowId: number;
    workflowStepId: number;
    assignedTo: number | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    estimatedHours: number | null;
  };
}

const priorityOptions = [
  { value: "low", label: "کم" },
  { value: "medium", label: "متوسط" },
  { value: "high", label: "زیاد" },
  { value: "critical", label: "بحرانی" },
];

const statusOptions = [
  { value: "pending", label: "در انتظار" },
  { value: "in_progress", label: "در حال انجام" },
  { value: "completed", label: "تکمیل شده" },
  { value: "rejected", label: "رد شده" },
  { value: "on_hold", label: "متوقف" },
];

export default function TaskForm({
  workflows,
  workflowSteps,
  users,
  initialData,
}: TaskFormProps) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    workflowId: initialData?.workflowId?.toString() || "",
    workflowStepId: initialData?.workflowStepId?.toString() || "",
    assignedTo: initialData?.assignedTo?.toString() || "",
    status: initialData?.status || "pending",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate?.slice(0, 10) || "",
    estimatedHours: initialData?.estimatedHours?.toString() || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const isEdit = !!initialData;

  const filteredSteps = workflowSteps.filter(
    (s) => !form.workflowId || s.workflowId === Number(form.workflowId)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "workflowId" ? { workflowStepId: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      ...form,
      workflowId: Number(form.workflowId) || null,
      workflowStepId: Number(form.workflowStepId) || null,
      assignedTo: form.assignedTo ? Number(form.assignedTo) : null,
      estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : null,
      dueDate: form.dueDate || null,
    };

    try {
      const url = isEdit ? `/api/tasks/${initialData!.id}` : "/api/tasks";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          setErrors(data.errors);
        }
        throw new Error(data.error || "خطا در ثبت تسک");
      }

      toast.success(isEdit ? "تسک با موفقیت بروزرسانی شد." : "تسک با موفقیت ایجاد شد.");
      router.push(`/tasks/${data.id}`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ثبت تسک");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="عنوان تسک"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="مثال: درخواست مرخصی سالانه"
          error={errors.title}
          icon="fa-solid fa-list-check"
        />
        <Select
          label="گردش کار"
          name="workflowId"
          value={form.workflowId}
          onChange={handleChange}
          required
          options={workflows.map((w) => ({ value: w.id.toString(), label: w.title }))}
          placeholder="انتخاب گردش کار..."
          error={errors.workflowId}
        />
      </div>

      <Textarea
        label="توضیحات"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="توضیحات تسک..."
        error={errors.description}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Select
          label="مرحله گردش کار"
          name="workflowStepId"
          value={form.workflowStepId}
          onChange={handleChange}
          required
          options={filteredSteps.map((s) => ({ value: s.id.toString(), label: s.name }))}
          placeholder="انتخاب مرحله..."
          error={errors.workflowStepId}
        />
        <Select
          label="مسئول"
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          options={[
            { value: "", label: "بدون مسئول" },
            ...users.map((u) => ({ value: u.id.toString(), label: `${u.name} (${u.email})` })),
          ]}
          error={errors.assignedTo}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Select
          label="وضعیت"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
        />
        <Select
          label="اولویت"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          options={priorityOptions}
          required
          error={errors.priority}
        />
        <Input
          label="ساعت تخمینی"
          name="estimatedHours"
          type="number"
          min={1}
          value={form.estimatedHours}
          onChange={handleChange}
          placeholder="مثال: 8"
          error={errors.estimatedHours}
          icon="fa-solid fa-clock"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="تاریخ پایان"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <Button type="submit" isLoading={isSubmitting}>
          <i className="fa-solid fa-floppy-disk" />
          {isEdit ? "بروزرسانی" : "ایجاد"} تسک
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          انصراف
        </Button>
      </div>
    </form>
  );
}