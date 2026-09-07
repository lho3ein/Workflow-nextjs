import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSupervisor } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import DeleteButton from "@/components/ui/DeleteButton";
import {
  TaskStatusBadge,
  TaskPriorityBadge,
  StepStatusBadge,
} from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import { formatDate, formatDateTime, formatNumber } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskShowPage({ params }: Props) {
  await requireSupervisor();
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
    include: {
      workflow: { include: { department: true } },
      workflowStep: {
        include: { assignee: { select: { name: true } } },
      },
      assignee: { select: { id: true, name: true, email: true } },
      creator: { select: { id: true, name: true, email: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!task) notFound();

  const infoItems: Array<{
    label: string;
    value: string;
    icon: string;
    href?: string;
  }> = [
    { label: "گردش کار", value: task.workflow?.title || "—", icon: "fa-solid fa-diagram-project", href: `/workflows/${task.workflow?.id}` },
    { label: "مرحله گردش کار", value: task.workflowStep?.name || "—", icon: "fa-solid fa-list-ol" },
    { label: "مسئول", value: task.assignee?.name || "—", icon: "fa-solid fa-user-check" },
    { label: "ایجادکننده", value: task.creator?.name || "—", icon: "fa-solid fa-circle-plus" },
    { label: "مهلت", value: formatDate(task.dueDate), icon: "fa-solid fa-calendar-xmark" },
    { label: "ساعت تخمینی", value: task.estimatedHours ? formatNumber(task.estimatedHours) : "—", icon: "fa-solid fa-clock" },
    { label: "ساعت واقعی", value: task.actualHours ? formatNumber(task.actualHours) : "—", icon: "fa-solid fa-stopwatch" },
    { label: "تاریخ شروع", value: formatDateTime(task.startedAt), icon: "fa-solid fa-play" },
    { label: "تاریخ تکمیل", value: formatDateTime(task.completedAt), icon: "fa-solid fa-check" },
    { label: "تاریخ ایجاد", value: formatDate(task.createdAt), icon: "fa-solid fa-calendar-plus" },
  ];

  return (
    <div>
      <PageHeader
        title={task.title}
        subtitle="جزئیات تسک و اطلاعات مرتبط"
        icon="fa-solid fa-list-check"
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
        <Badge tone="gray">
          <i className="fa-solid fa-diagram-project" />
          {task.workflow?.title}
        </Badge>
        {task.workflowStep && (
          <Badge tone="purple">
            <i className="fa-solid fa-list-ol" />
            {task.workflowStep.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader title="مشخصات تسک" icon="fa-solid fa-circle-info" />
            <CardBody>
              {task.description && (
                <div className="mb-4 rounded-xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-medium text-slate-400">توضیحات</p>
                  <p className="text-sm text-slate-700">{task.description}</p>
                </div>
              )}

              <dl className="space-y-3">
                {infoItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <i className={`${item.icon} text-xs`} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-400">{item.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium text-slate-700">
                        {"href" in item && item.href ? (
                          <Link href={item.href} className="transition hover:text-slate-500 hover:underline">
                            {item.value}
                          </Link>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={`/tasks/${task.id}/edit`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                >
                  <i className="fa-solid fa-pen" />
                  ویرایش
                </Link>
                <DeleteButton
                  id={task.id}
                  entityName="تسک"
                  endpoint="/api/tasks"
                  redirectTo="/tasks"
                />
              </div>
            </CardBody>
          </Card>

          {task.workflowStep && (
            <Card>
              <CardHeader
                title="مرحله فعلی گردش کار"
                subtitle="وضعیت مرحله مربوطه"
                icon="fa-solid fa-list-ol"
              />
              <CardBody>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <i className="fa-solid fa-list-ol" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">{task.workflowStep.name}</p>
                      <StepStatusBadge status={task.workflowStep.status} />
                    </div>
                    {task.workflowStep.description && (
                      <p className="mt-1 text-xs text-slate-500">{task.workflowStep.description}</p>
                    )}
                    {task.workflowStep.assignee && (
                      <p className="mt-1 text-xs text-slate-400">
                        <i className="fa-solid fa-user ml-1" />
                        {task.workflowStep.assignee.name}
                      </p>
                    )}
                    {task.workflowStep.dueDate && (
                      <p className="mt-1 text-xs text-slate-400">
                        <i className="fa-regular fa-calendar ml-1" />
                        {formatDate(task.workflowStep.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="نظرات"
              subtitle={`${formatNumber(task.comments.length)} نظر`}
              icon="fa-solid fa-comments"
            />
            <CardBody>
              {task.comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <i className="fa-solid fa-comment-dots text-2xl" />
                  </div>
                  <p className="text-sm text-slate-500">هنوز نظری ثبت نشده است</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-xs font-bold text-white">
                            {comment.user?.name?.charAt(0) || "؟"}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{comment.user?.name}</p>
                            <p className="text-xs text-slate-400">{formatDateTime(comment.createdAt)}</p>
                          </div>
                        </div>
                        {comment.isInternal && (
                          <Badge tone="amber">
                            <i className="fa-solid fa-lock" />
                            داخلی
                          </Badge>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}