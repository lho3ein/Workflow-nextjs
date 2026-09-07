import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSupervisor } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import DeleteButton from "@/components/ui/DeleteButton";
import {
  WorkflowStatusBadge,
  WorkflowPriorityBadge,
  StepStatusBadge,
  TaskStatusBadge,
  TaskPriorityBadge,
} from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import { formatDate, formatNumber } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkflowShowPage({ params }: Props) {
  await requireSupervisor();
  const { id } = await params;

  const workflow = await prisma.workflow.findUnique({
    where: { id: parseInt(id) },
    include: {
      department: true,
      creator: { select: { id: true, name: true, email: true } },
      steps: {
        orderBy: { order: "asc" },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
      },
      tasks: {
        orderBy: { createdAt: "desc" },
        include: {
          workflowStep: { select: { name: true } },
          assignee: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!workflow) notFound();

  const infoItems = [
    { label: "دپارتمان", value: workflow.department?.name || "—", icon: "fa-solid fa-building-columns" },
    { label: "ایجادکننده", value: workflow.creator?.name || "—", icon: "fa-solid fa-user" },
    { label: "اولویت", value: `وضعیت (${workflow.priority})`, icon: "fa-solid fa-flag" },
    { label: "تاریخ شروع", value: formatDate(workflow.startDate), icon: "fa-solid fa-calendar-play" },
    { label: "تاریخ پایان", value: formatDate(workflow.dueDate), icon: "fa-solid fa-calendar-xmark" },
    { label: "تاریخ ایجاد", value: formatDate(workflow.createdAt), icon: "fa-solid fa-calendar-plus" },
  ];

  return (
    <div>
      <PageHeader
        title={workflow.title}
        subtitle="جزئیات گردش کار و مراحل مربوطه"
        icon="fa-solid fa-diagram-project"
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <WorkflowStatusBadge status={workflow.status} />
        <WorkflowPriorityBadge priority={workflow.priority} />
        <Badge tone="gray">
          <i className="fa-solid fa-building-columns" />
          {workflow.department?.name}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader title="مشخصات گردش کار" icon="fa-solid fa-circle-info" />
            <CardBody>
              {workflow.description && (
                <div className="mb-4 rounded-xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-medium text-slate-400">توضیحات</p>
                  <p className="text-sm text-slate-700">{workflow.description}</p>
                </div>
              )}

              <dl className="space-y-3">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <i className={`${item.icon} text-xs`} />
                    </span>
                    <div>
                      <dt className="text-xs text-slate-400">{item.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium text-slate-700">{item.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={`/workflows/${workflow.id}/edit`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                >
                  <i className="fa-solid fa-pen" />
                  ویرایش
                </Link>
                <DeleteButton
                  id={workflow.id}
                  entityName="گردش کار"
                  endpoint="/api/workflows"
                  redirectTo="/workflows"
                />
              </div>
            </CardBody>
          </Card>

          {workflow.steps.length > 0 && (
            <Card>
              <CardHeader
                title="مراحل گردش کار"
                subtitle={`${formatNumber(workflow.steps.length)} مرحله`}
                icon="fa-solid fa-list-ol"
              />
              <CardBody className="space-y-0">
                <div className="relative">
                  <div className="absolute right-[15px] top-2 bottom-2 w-px bg-slate-200" />
                  <div className="space-y-4">
                    {workflow.steps.map((step, i) => (
                      <div key={step.id} className="relative flex items-start gap-4">
                        <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-xs font-bold text-slate-500">
                          {formatNumber(i + 1)}
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-slate-800">{step.name}</p>
                            <StepStatusBadge status={step.status} />
                          </div>
                          {step.description && (
                            <p className="mt-0.5 text-xs text-slate-500">{step.description}</p>
                          )}
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            {step.assignee && (
                              <span>
                                <i className="fa-solid fa-user ml-1" />
                                {step.assignee.name}
                              </span>
                            )}
                            {step.dueDate && (
                              <span>
                                <i className="fa-regular fa-calendar ml-1" />
                                {formatDate(step.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="تسک‌های گردش کار"
              subtitle={`${formatNumber(workflow.tasks.length)} تسک`}
              icon="fa-solid fa-list-check"
              action={
                <Link
                  href="/tasks/new"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
                >
                  <i className="fa-solid fa-plus" />
                  تسک جدید
                </Link>
              }
            />
            <CardBody className="p-0">
              {workflow.tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <i className="fa-solid fa-list-check text-2xl" />
                  </div>
                  <p className="text-sm text-slate-500">هیچ تسکی برای این گردش کار ثبت نشده است</p>
                  <Link
                    href="/tasks/new"
                    className="mt-4 text-sm font-medium text-slate-800 hover:underline"
                  >
                    ایجاد تسک
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                        <th className="px-5 py-4 font-medium">عنوان</th>
                        <th className="px-5 py-4 font-medium">مرحله</th>
                        <th className="px-5 py-4 font-medium">مسئول</th>
                        <th className="px-5 py-4 font-medium">اولویت</th>
                        <th className="px-5 py-4 font-medium">وضعیت</th>
                        <th className="px-5 py-4 font-medium">مهلت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {workflow.tasks.map((task) => (
                        <tr key={task.id} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4">
                            <Link
                              href={`/tasks/${task.id}`}
                              className="font-medium text-slate-800 transition hover:text-slate-600"
                            >
                              {task.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{task.workflowStep?.name || "—"}</td>
                          <td className="px-5 py-4 text-slate-600">{task.assignee?.name || "—"}</td>
                          <td className="px-5 py-4">
                            <TaskPriorityBadge priority={task.priority} />
                          </td>
                          <td className="px-5 py-4">
                            <TaskStatusBadge status={task.status} />
                          </td>
                          <td className="px-5 py-4 text-slate-500">{formatDate(task.dueDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}