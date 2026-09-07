import React from "react";
import { requireManager } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import DepartmentForm from "@/components/forms/DepartmentForm";

export default async function NewDepartmentPage() {
  await requireManager();

  return (
    <div>
      <PageHeader
        title="ایجاد دپارتمان"
        subtitle="دپارتمان جدید به سازمان اضافه کنید"
        icon="fa-solid fa-building-circle-plus"
      />

      <Card className="max-w-2xl">
        <CardHeader
          title="مشخصات دپارتمان"
          subtitle="فیلدهای ستاره‌دار الزامی هستند"
          icon="fa-solid fa-clipboard-list"
        />
        <CardBody>
          <DepartmentForm />
        </CardBody>
      </Card>
    </div>
  );
}