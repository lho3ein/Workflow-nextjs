import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatCard from "@/components/ui/StatCard";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import { WorkflowStatusBadge, TaskPriorityBadge } from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
   const session = await getServerSession(authOptions);

   const [totalDepartments, totalWorkflows, totalTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([prisma.department.count(), prisma.workflow.count(), prisma.task.count(), prisma.task.count({ where: { status: "pending" } }), prisma.task.count({ where: { status: "in_progress" } }), prisma.task.count({ where: { status: "completed" } })]);

   const recentWorkflows = await prisma.workflow.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { department: true, creator: true },
   });

   const recentTasks = await prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { workflow: true, assignee: true },
   });

   const stats = {
      totalDepartments,
      totalWorkflows,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
   };

   return (
      <div className="space-y-6">
         <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-800 lg:text-2xl">
               <i className="fa-solid fa-gauge-high ml-2 text-slate-400" />
               داشبورد
            </h1>
            <p className="mt-1 text-sm text-slate-500">خوش آمدید، {session?.user.name} عزیز! نمای کلی سیستم گردش کار را مشاهده می‌کنید.</p>
         </div>

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard title="دپارتمان‌ها" value={stats.totalDepartments} icon="fa-solid fa-building-columns" color="slate" />
            <StatCard title="گردش کارها" value={stats.totalWorkflows} icon="fa-solid fa-diagram-project" color="purple" />
            <StatCard title="کل تسک‌ها" value={stats.totalTasks} icon="fa-solid fa-list-check" color="blue" />
            <StatCard title="در انتظار" value={stats.pendingTasks} icon="fa-solid fa-clock" color="amber" />
            <StatCard title="در حال انجام" value={stats.inProgressTasks} icon="fa-solid fa-spinner" color="sky" />
            <StatCard title="تکمیل شده" value={stats.completedTasks} icon="fa-solid fa-circle-check" color="emerald" />
         </div>

         <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card>
               <CardHeader
                  title="گردش کارهای اخیر"
                  icon="fa-solid fa-diagram-project"
                  action={
                     <Link href="/workflows" className="text-xs font-medium text-slate-500 transition hover:text-slate-800">
                        مشاهده همه <i className="fa-solid fa-arrow-left mr-1" />
                     </Link>
                  }
               />
               <CardBody>
                  {recentWorkflows.length === 0 ? (
                     <EmptyState message="هنوز گردش کاری ثبت نشده است" />
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead>
                              <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                                 <th className="pb-3 pr-2 font-medium">عنوان</th>
                                 <th className="pb-3 font-medium">دپارتمان</th>
                                 <th className="pb-3 font-medium">اولویت</th>
                                 <th className="pb-3 font-medium">وضعیت</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {recentWorkflows.map((wf) => (
                                 <tr key={wf.id} className="transition hover:bg-slate-50/70">
                                    <td className="py-3 pr-2">
                                       <Link href={`/workflows/${wf.id}`} className="font-medium text-slate-800 transition hover:text-slate-600">
                                          {wf.title}
                                       </Link>
                                    </td>
                                    <td className="py-3 text-slate-600">{wf.department?.name}</td>
                                    <td className="py-3">
                                       <Badge tone={wf.priority >= 3 ? "red" : wf.priority === 2 ? "blue" : "gray"}>{wf.priority >= 3 ? "زیاد" : wf.priority === 2 ? "متوسط" : "کم"}</Badge>
                                    </td>
                                    <td className="py-3">
                                       <WorkflowStatusBadge status={wf.status} />
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
                  <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">آخرین به‌روزرسانی: {formatDate(new Date())}</div>
               </CardBody>
            </Card>

            <Card>
               <CardHeader
                  title="تسک‌های اخیر"
                  icon="fa-solid fa-list-check"
                  action={
                     <Link href="/tasks" className="text-xs font-medium text-slate-500 transition hover:text-slate-800">
                        مشاهده همه <i className="fa-solid fa-arrow-left mr-1" />
                     </Link>
                  }
               />
               <CardBody>
                  {recentTasks.length === 0 ? (
                     <EmptyState message="هنوز تسکی ثبت نشده است" />
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead>
                              <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                                 <th className="pb-3 pr-2 font-medium">عنوان</th>
                                 <th className="pb-3 font-medium">گردش کار</th>
                                 <th className="pb-3 font-medium">مسئول</th>
                                 <th className="pb-3 font-medium">اولویت</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {recentTasks.map((task) => (
                                 <tr key={task.id} className="transition hover:bg-slate-50/70">
                                    <td className="py-3 pr-2">
                                       <Link href={`/tasks/${task.id}`} className="font-medium text-slate-800 transition hover:text-slate-600">
                                          {task.title}
                                       </Link>
                                    </td>
                                    <td className="py-3 text-slate-600">{task.workflow?.title}</td>
                                    <td className="py-3 text-slate-600">{task.assignee?.name || "—"}</td>
                                    <td className="py-3">
                                       <TaskPriorityBadge priority={task.priority} />
                                    </td>
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
   );
}

function EmptyState({ message }: { message: string }) {
   return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
         <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <i className="fa-solid fa-inbox text-2xl" />
         </div>
         <p className="text-sm text-slate-500">{message}</p>
      </div>
   );
}
