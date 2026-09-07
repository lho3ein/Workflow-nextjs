import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSupervisor } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import DeleteButton from "@/components/ui/DeleteButton";
import { WorkflowStatusBadge, WorkflowPriorityBadge } from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { formatNumber } from "@/lib/utils";

interface Props {
   searchParams: Promise<{ page?: string }>;
}

export default async function WorkflowsPage({ searchParams }: Props) {
   await requireSupervisor();
   const { page: pageParam } = await searchParams;
   const page = Math.max(1, parseInt(pageParam || "1"));
   const perPage = 10;

   const skip = (page - 1) * perPage;
   const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
         orderBy: { createdAt: "desc" },
         skip,
         take: perPage,
         include: {
            department: true,
            creator: { select: { id: true, name: true } },
            _count: { select: { tasks: true, steps: true } },
         },
      }),
      prisma.workflow.count(),
   ]);

   return (
      <div>
         <PageHeader title="گردش کارها" subtitle="مدیریت فرآیندها و گردش کارهای سازمان" icon="fa-solid fa-diagram-project" buttonLabel="ایجاد گردش کار" buttonHref="/workflows/new" />

         <Card>
            <CardHeader title="لیست گردش کارها" subtitle={`${formatNumber(total)} گردش کار ثبت شده`} icon="fa-solid fa-list" />
            <CardBody className="p-0">
               {workflows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                     <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <i className="fa-solid fa-diagram-project text-2xl" />
                     </div>
                     <p className="text-sm text-slate-500">هنوز گردش کاری ثبت نشده است</p>
                     <Link href="/workflows/new" className="mt-4 text-sm font-medium text-slate-800 hover:underline">
                        اولین گردش کار را ایجاد کنید
                     </Link>
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead>
                           <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                              <th className="px-5 py-4 font-medium">عنوان</th>
                              <th className="px-5 py-4 font-medium">دپارتمان</th>
                              <th className="px-5 py-4 font-medium">اولویت</th>
                              <th className="px-5 py-4 font-medium">مراحل</th>
                              <th className="px-5 py-4 font-medium">تسک‌ها</th>
                              <th className="px-5 py-4 font-medium">وضعیت</th>
                              <th className="px-5 py-4 font-medium">عملیات</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {workflows.map((wf) => (
                              <tr key={wf.id} className="transition hover:bg-slate-50/70">
                                 <td className="px-5 py-4">
                                    <Link href={`/workflows/${wf.id}`} className="font-medium text-slate-800 transition hover:text-slate-600">
                                       <i className="fa-solid fa-diagram-project ml-2 text-slate-300" />
                                       {wf.title}
                                    </Link>
                                 </td>
                                 <td className="px-5 py-4 text-slate-600">{wf.department?.name}</td>
                                 <td className="px-5 py-4">
                                    <WorkflowPriorityBadge priority={wf.priority} />
                                 </td>
                                 <td className="px-5 py-4 text-slate-600">{formatNumber(wf._count.steps)}</td>
                                 <td className="px-5 py-4 text-slate-600">{formatNumber(wf._count.tasks)}</td>
                                 <td className="px-5 py-4">
                                    <WorkflowStatusBadge status={wf.status} />
                                 </td>
                                 <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                       <Link href={`/workflows/${wf.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200" title="مشاهده">
                                          <i className="fa-solid fa-eye text-xs" />
                                       </Link>
                                       <Link href={`/workflows/${wf.id}/edit`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition hover:bg-sky-100" title="ویرایش">
                                          <i className="fa-solid fa-pen text-xs" />
                                       </Link>
                                       <DeleteButton id={wf.id} entityName="گردش کار" endpoint="/api/workflows" />
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
