"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface DepartmentFormProps {
  initialData?: {
    id: number;
    name: string;
    description: string | null;
    managerName: string | null;
    phone: string | null;
    email: string | null;
    isActive: boolean;
  };
}

export default function DepartmentForm({ initialData }: DepartmentFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    managerName: initialData?.managerName || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    isActive: initialData?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const isEdit = !!initialData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const url = isEdit ? `/api/departments/${initialData!.id}` : "/api/departments";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          setErrors(data.errors);
          setForm((prev) => ({ ...prev }));
        }
        throw new Error(data.error || "خطا در ثبت دپارتمان");
      }

      toast.success(isEdit ? "دپارتمان با موفقیت بروزرسانی شد." : "دپارتمان با موفقیت ایجاد شد.");
      router.push("/departments");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ثبت دپارتمان");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="نام دپارتمان"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="مثال: فناوری اطلاعات"
          error={errors.name}
          icon="fa-solid fa-building-columns"
        />
        <Input
          label="مدیر دپارتمان"
          name="managerName"
          value={form.managerName}
          onChange={handleChange}
          placeholder="مثال: مهندس احمد محمدی"
          error={errors.managerName}
          icon="fa-solid fa-user-tie"
        />
      </div>

      <Textarea
        label="توضیحات"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="توضیحات دپارتمان..."
        error={errors.description}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="تلفن"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="مثال: 021-12345678"
          error={errors.phone}
          icon="fa-solid fa-phone"
        />
        <Input
          label="ایمیل"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="مثال: it@company.com"
          error={errors.email}
          icon="fa-solid fa-envelope"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
        />
        <label htmlFor="isActive" className="text-sm text-slate-700">
          دپارتمان فعال
        </label>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <Button type="submit" isLoading={isSubmitting}>
          <i className="fa-solid fa-floppy-disk" />
          {isEdit ? "بروزرسانی" : "ایجاد"} دپارتمان
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}