import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import DeleteButton from "@/components/ui/DeleteButton";
import Badge from "@/components/ui/Badge";
import { formatDate, formatNumber } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DepartmentShowPage({ params }: Props) {
  await requireManager();
  const { id } = await params;

  const department = await prisma.department.findUnique({
    where: { id: parseInt(id) },
    include: {
      workflows: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { tasks: true, steps: true } },
          creator: { select: { name: true } },
        },
      },
      _count: { select: { workflows: true, users: true } },
    },
  });

  if (!department) notFound();

  const infoItems = [
    { label: "شناسه", value: formatNumber(department.id), icon: "fa-solid fa-hashtag" },
    { label: "مدیر دپارتمان", value: department.managerName || "—", icon: "fa-solid fa-user-tie" },
    { label: "تلفن", value: department.phone || "—", icon: "fa-solid fa-phone", ltr: true },
    { label: "ایمیل", value: department.email || "—", icon: "fa-solid fa-envelope", ltr: true },
    { label: "تاریخ ایجاد", value: formatDate(department.createdAt), icon: "fa-solid fa-calendar-plus" },
    { label: "آخرین بروزرسانی", value: formatDate(department.updatedAt), icon: "fa-solid fa-pen" },
  ];

  return (
    <div>
      <PageHeader
        title={department.name}
        subtitle="مشخصات و گردش کارهای دپارتمان"
        icon="fa-solid fa-building-columns"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader
              title="مشخصات دپارتمان"
              icon="fa-solid fa-circle-info"
              action={
                <div className="flex items-center gap-2">
                  {department.isActive ? (
                    <Badge tone="green">
                      <i className="fa-solid fa-circle-check" />
                      فعال
                    </Badge>
                  ) : (
                    <Badge tone="gray">
                      <i className="fa-solid fa-circle-minus" />
                      غیرفعال
                    </Badge>
                  )}
                </div>
              }
            />
            <CardBody>
              <div className="flex flex-col items-center gap-3 border-b border-slate-100 pb-4 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 text-2xl text-white">
                  <i className="fa-solid fa-building-columns" />
                </span>
                <div>
                  <p className="text-base font-bold text-slate-800">{department.name}</p>
                  <p className="text-xs text-slate-500">{department.managerName || "بدون مدیر"}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-2xl font-bold text-slate-800">{formatNumber(department._count.workflows)}</p>
                  <p className="mt-1 text-xs text-slate-500">گردش کار</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-2xl font-bold text-slate-800">{formatNumber(department._count.users)}</p>
                  <p className="mt-1 text-xs text-slate-500">کاربر</p>
                </div>
              </div>

              <dl className="mt-4 space-y-3">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <i className={`${item.icon} text-xs`} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-400">{item.label}</dt>
                      <dd
                        className="mt-0.5 text-sm font-medium text-slate-700"
                        dir={item.ltr ? "ltr" : undefined}
                        style={item.ltr ? { textAlign: "right" } : undefined}
                      >
                        {item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              {department.description && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-medium text-slate-400">توضیحات</p>
                  <p className="text-sm text-slate-700">{department.description}</p>
                </div>
              )}

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={`/departments/${department.id}/edit`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                >
                  <i className="fa-solid fa-pen" />
                  ویرایش
                </Link>
                <DeleteButton
                  id={department.id}
                  entityName="دپارتمان"
                  endpoint="/api/departments"
                  redirectTo="/departments"
                />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="گردش کارهای دپارتمان"
              subtitle="لیست گردش کارهای این دپارتمان"
              icon="fa-solid fa-diagram-project"
            />
            <CardBody className="p-0">
              {department.workflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <i className="fa-solid fa-diagram-project text-2xl" />
                  </div>
                  <p className="text-sm text-slate-500">هیچ گردش کاری برای این دپارتمان ثبت نشده است</p>
                  <Link
                    href="/workflows/new"
                    className="mt-4 text-sm font-medium text-slate-800 hover:underline"
                  >
                    ایجاد گردش کار
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                        <th className="px-5 py-4 font-medium">عنوان</th>
                        <th className="px-5 py-4 font-medium">ایجادکننده</th>
                        <th className="px-5 py-4 font-medium">مراحل</th>
                        <th className="px-5 py-4 font-medium">تسک‌ها</th>
                        <th className="px-5 py-4 font-medium">تاریخ ایجاد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {department.workflows.map((wf) => (
                        <tr key={wf.id} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4">
                            <Link
                              href={`/workflows/${wf.id}`}
                              className="font-medium text-slate-800 transition hover:text-slate-600"
                            >
                              {wf.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{wf.creator?.name}</td>
                          <td className="px-5 py-4">
                            <Badge tone="purple">
                              <i className="fa-solid fa-layer-group" />
                              {formatNumber(wf._count.steps)}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            <Badge tone="blue">
                              <i className="fa-solid fa-list-check" />
                              {formatNumber(wf._count.tasks)}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-slate-500">{formatDate(wf.createdAt)}</td>
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