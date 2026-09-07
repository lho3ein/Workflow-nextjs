"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { WorkflowStatus } from "@prisma/client";

interface Department {
  id: number;
  name: string;
}

interface WorkflowFormProps {
  departments: Department[];
  initialData?: {
    id: number;
    title: string;
    description: string | null;
    departmentId: number;
    status: WorkflowStatus;
    priority: number;
    startDate: string | null;
    dueDate: string | null;
  };
}

const priorityOptions = [
  { value: "1", label: "کم (۱)" },
  { value: "2", label: "متوسط (۲)" },
  { value: "3", label: "زیاد (۳)" },
  { value: "4", label: "بحرانی (۴)" },
];

const statusOptions = [
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
  { value: "archived", label: "آرشیو شده" },
];

export default function WorkflowForm({
  departments,
  initialData,
}: WorkflowFormProps) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    departmentId: initialData?.departmentId?.toString() || "",
    status: initialData?.status || "active",
    priority: initialData?.priority?.toString() || "1",
    startDate: initialData?.startDate?.slice(0, 10) || "",
    dueDate: initialData?.dueDate?.slice(0, 10) || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const isEdit = !!initialData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      ...form,
      departmentId: Number(form.departmentId) || null,
      priority: Number(form.priority) || 1,
      startDate: form.startDate || null,
      dueDate: form.dueDate || null,
    };

    try {
      const url = isEdit ? `/api/workflows/${initialData!.id}` : "/api/workflows";
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
        throw new Error(data.error || "خطا در ثبت گردش کار");
      }

      toast.success(isEdit ? "گردش کار با موفقیت بروزرسانی شد." : "گردش کار با موفقیت ایجاد شد.");
      router.push(`/workflows/${data.id}`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ثبت گردش کار");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="عنوان گردش کار"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="مثال: تایید درخواست مرخصی"
          error={errors.title}
          icon="fa-solid fa-diagram-project"
        />
        <Select
          label="دپارتمان"
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
          required
          options={departments.map((d) => ({ value: d.id.toString(), label: d.name }))}
          placeholder="انتخاب دپارتمان..."
          error={errors.departmentId}
        />
      </div>

      <Textarea
        label="توضیحات"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="توضیحات گردش کار..."
        error={errors.description}
      />

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
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="تاریخ شروع"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          error={errors.startDate}
        />
        <Input
          label="تاریخ پایان"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />
      </div>

      {errors.dueDate && (
        <p className="text-sm text-red-500">
          <i className="fa-solid fa-circle-exclamation ml-1" />
          {errors.dueDate}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <Button type="submit" isLoading={isSubmitting}>
          <i className="fa-solid fa-floppy-disk" />
          {isEdit ? "بروزرسانی" : "ایجاد"} گردش کار
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          انصراف
        </Button>
      </div>
    </form>
  );
}