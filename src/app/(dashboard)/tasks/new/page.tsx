import React from "react";
import { prisma } from "@/lib/prisma";
import { requireSupervisor } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import TaskForm from "@/components/forms/TaskForm";

export default async function NewTaskPage() {
  await requireSupervisor();

  const [workflows, workflowSteps, users] = await Promise.all([
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

  return (
    <div>
      <PageHeader
        title="ایجاد تسک"
        subtitle="تسک جدیدی به گردش کار اضافه کنید"
        icon="fa-solid fa-list-check"
      />

      <Card className="max-w-2xl">
        <CardHeader
          title="مشخصات تسک"
          subtitle="فیلدهای ستاره‌دار الزامی هستند"
          icon="fa-solid fa-clipboard-list"
        />
        <CardBody>
          <TaskForm workflows={workflows} workflowSteps={workflowSteps} users={users} />
        </CardBody>
      </Card>
    </div>
  );
}