import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import DepartmentForm from "@/components/forms/DepartmentForm";

interface Props {
   params: Promise<{ id: string }>;
}

export default async function EditDepartmentPage({ params }: Props) {
   await requireManager();
   const { id } = await params;

   const department = await prisma.department.findUnique({
      where: { id: parseInt(id) },
   });

   if (!department) notFound();

   return (
      <div>
         <PageHeader title={`ویرایش دپارتمان ${department.name}`} subtitle="مشخصات دپارتمان را بروزرسانی کنید" icon="fa-solid fa-building-pen" />

         <Card className="max-w-2xl">
            <CardHeader title="ویرایش دپارتمان" subtitle="نیازهای خود را تغییر دهید و ذخیره کنید" icon="fa-solid fa-clipboard-list" />
            <CardBody>
               <DepartmentForm
                  initialData={{
                     id: department.id,
                     name: department.name,
                     description: department.description,
                     managerName: department.managerName,
                     phone: department.phone,
                     email: department.email,
                     isActive: department.isActive,
                  }}
               />
            </CardBody>
         </Card>
      </div>
   );
}
