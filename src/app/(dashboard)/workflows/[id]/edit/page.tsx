import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSupervisor } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import WorkflowForm from "@/components/forms/WorkflowForm";

interface Props {
   params: Promise<{ id: string }>;
}

export default async function EditWorkflowPage({ params }: Props) {
   await requireSupervisor();
   const { id } = await params;

   const [workflow, departments] = await Promise.all([
      prisma.workflow.findUnique({ where: { id: parseInt(id) } }),
      prisma.department.findMany({
         where: { isActive: true },
         select: { id: true, name: true },
         orderBy: { name: "asc" },
      }),
   ]);

   if (!workflow) notFound();

   return (
      <div>
         <PageHeader title={`ویرایش گردش کار ${workflow.title}`} subtitle="مشخصات گردش کار را بروزرسانی کنید" icon="fa-solid fa-diagram-pen" />

         <Card className="max-w-2xl">
            <CardHeader title="ویرایش گردش کار" subtitle="نیازهای خود را تغییر دهید و ذخیره کنید" icon="fa-solid fa-clipboard-list" />
            <CardBody>
               <WorkflowForm
                  departments={departments}
                  initialData={{
                     id: workflow.id,
                     title: workflow.title,
                     description: workflow.description,
                     departmentId: workflow.departmentId,
                     status: workflow.status,
                     priority: workflow.priority,
                     startDate: workflow.startDate?.toISOString() || null,
                     dueDate: workflow.dueDate?.toISOString() || null,
                  }}
               />
            </CardBody>
         </Card>
      </div>
   );
}
