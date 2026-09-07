import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSupervisor } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import TaskForm from "@/components/forms/TaskForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: Props) {
  await requireSupervisor();
  const { id } = await params;

  const [task, workflows, workflowSteps, users] = await Promise.all([
    prisma.task.findUnique({ where: { id: parseInt(id) } }),
    prisma.workflow.findMany({
      where: { status: "active" },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.workflowStep.findMany({
      select: { id: true, name: true, workflowId: true },
      orderBy: { order: "asc" },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!task) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش تسک ${task.title}`}
        subtitle="مشخصات تسک را بروزرسانی کنید"
        icon="fa-solid fa-list-check"
      />

      <Card className="max-w-2xl">
        <CardHeader
          title="ویرایش تسک"
          subtitle="نیازهای خود را تغییر دهید و ذخیره کنید"
          icon="fa-solid fa-clipboard-list"
        />
        <CardBody>
          <TaskForm
            workflows={workflows}
            workflowSteps={workflowSteps}
            users={users}
            initialData={{
              id: task.id,
              title: task.title,
              description: task.description,
              workflowId: task.workflowId,
              workflowStepId: task.workflowStepId,
              assignedTo: task.assignedTo,
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate?.toISOString() || null,
              estimatedHours: task.estimatedHours,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}