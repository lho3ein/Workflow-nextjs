import React from "react";
import { prisma } from "@/lib/prisma";
import { requireSupervisor } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import WorkflowForm from "@/components/forms/WorkflowForm";

export default async function NewWorkflowPage() {
   await requireSupervisor();

   const departments = await prisma.department.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
   });

   return (
      <div>
         <PageHeader title="ایجاد گردش کار" subtitle="فرآیند جدیدی برای سازمان تعریف کنید" icon="fa-solid fa-diagram-project" />

         <Card className="max-w-2xl">
            <CardHeader title="مشخصات گردش کار" subtitle="فیلدهای ستاره‌دار الزامی هستند" icon="fa-solid fa-clipboard-list" />
            <CardBody>
               <WorkflowForm departments={departments} />
            </CardBody>
         </Card>
      </div>
   );
}
