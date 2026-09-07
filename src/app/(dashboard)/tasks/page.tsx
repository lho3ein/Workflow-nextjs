import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSupervisor } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import DeleteButton from "@/components/ui/DeleteButton";
import { TaskStatusBadge, TaskPriorityBadge } from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { formatDate, formatNumber } from "@/lib/utils";

interface Props {
   searchParams: Promise<{ page?: string }>;
}

export default async function TasksPage({ searchParams }: Props) {
   await requireSupervisor();
   const { page: pageParam } = await searchParams;
   const page = Math.max(1, parseInt(pageParam || "1"));
   const perPage = 10;

   const skip = (page - 1) * perPage;
   const [tasks, total] = await Promise.all([
      prisma.task.findMany({
         orderBy: { createdAt: "desc" },
         skip,
         take: perPage,
         include: {
            workflow: { select: { id: true, title: true } },
            workflowStep: { select: { id: true, name: true } },
            assignee: { select: { id: true, name: true } },
         },
      }),
      prisma.task.count(),
   ]);

   return (
      <div>
         <PageHeader title="تسک‌ها" subtitle="مدیریت تسک‌های گردش کار" icon="fa-solid fa-list-check" buttonLabel="ایجاد تسک" buttonHref="/tasks/new" />

         <Card>
            <CardHeader title="لیست تسک‌ها" subtitle={`${formatNumber(total)} تسک ثبت شده`} icon="fa-solid fa-list" />
            <CardBody className="p-0">
               {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                     <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <i className="fa-solid fa-list-check text-2xl" />
                     </div>
                     <p className="text-sm text-slate-500">هنوز تسکی ثبت نشده است</p>
                     <Link href="/tasks/new" className="mt-4 text-sm font-medium text-slate-800 hover:underline">
                        اولین تسک را ایجاد کنید
                     </Link>
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead>
                           <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                              <th className="px-5 py-4 font-medium">عنوان</th>
                              <th className="px-5 py-4 font-medium">گردش کار</th>
                              <th className="px-5 py-4 font-medium">مرحله</th>
                              <th className="px-5 py-4 font-medium">مسئول</th>
                              <th className="px-5 py-4 font-medium">اولویت</th>
                              <th className="px-5 py-4 font-medium">وضعیت</th>
                              <th className="px-5 py-4 font-medium">مهلت</th>
                              <th className="px-5 py-4 font-medium">عملیات</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {tasks.map((task) => (
                              <tr key={task.id} className="transition hover:bg-slate-50/70">
                                 <td className="px-5 py-4">
                                    <Link href={`/tasks/${task.id}`} className="font-medium text-slate-800 transition hover:text-slate-600">
                                       <i className="fa-solid fa-list-check ml-2 text-slate-300" />
                                       {task.title}
                                    </Link>
                                 </td>
                                 <td className="px-5 py-4 text-slate-600">{task.workflow?.title}</td>
                                 <td className="px-5 py-4 text-slate-600">{task.workflowStep?.name}</td>
                                 <td className="px-5 py-4 text-slate-600">{task.assignee?.name || "—"}</td>
                                 <td className="px-5 py-4">
                                    <TaskPriorityBadge priority={task.priority} />
                                 </td>
                                 <td className="px-5 py-4">
                                    <TaskStatusBadge status={task.status} />
                                 </td>
                                 <td className="px-5 py-4 text-slate-500">{formatDate(task.dueDate)}</td>
                                 <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                       <Link href={`/tasks/${task.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200" title="مشاهده">
                                          <i className="fa-solid fa-eye text-xs" />
                                       </Link>
                                       <Link href={`/tasks/${task.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition hover:bg-sky-100" title="ویرایش">
                                          <i className="fa-solid fa-pen text-xs" />
                                       </Link>
                                       <DeleteButton id={task.id} entityName="تسک" endpoint="/api/tasks" />
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
               <div className="px-5 pb-4">
                  <Pagination totalItems={total} currentPage={page} perPage={perPage} />
               </div>
            </CardBody>
         </Card>
      </div>
   );
}
