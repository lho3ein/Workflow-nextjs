"use client";

import React, { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";

interface DeleteButtonProps {
  id: number;
  entityName: string;
  endpoint: `/api/${string}`;
  redirectTo?: string;
}

export default function DeleteButton({
  id,
  entityName,
  endpoint,
  redirectTo,
}: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "خطا در حذف");
      }
      toast.success(`${entityName} با موفقیت حذف شد`);
      setIsOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در حذف");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
      >
        <i className="fa-solid fa-trash-can" />
        <span className="hidden sm:inline">حذف</span>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="تایید حذف"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <i className="fa-solid fa-triangle-exclamation text-2xl text-red-500" />
          </div>
          <p className="text-sm text-slate-600">
            آیا از حذف این {entityName} مطمئن هستید؟
            <br />
            این عملیات قابل بازگشت نیست.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              انصراف
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete} isLoading={isDeleting}>
              <i className="fa-solid fa-trash-can" />
              حذف {entityName}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}