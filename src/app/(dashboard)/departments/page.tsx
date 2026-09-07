import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/require";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import DeleteButton from "@/components/ui/DeleteButton";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { formatNumber } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function DepartmentsPage({ searchParams }: Props) {
  await requireManager();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1"));
  const perPage = 10;

  const skip = (page - 1) * perPage;
  const [departments, total] = await Promise.all([
    prisma.department.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
      include: {
        _count: { select: { workflows: true } },
        workflows: { select: { id: true } },
      },
    }),
    prisma.department.count(),
  ]);

  return (
    <div>
      <PageHeader
        title="دپارتمان‌ها"
        subtitle="مدیریت دپارتمان‌های سازمان"
        icon="fa-solid fa-building-columns"
        buttonLabel="ایجاد دپارتمان"
        buttonHref="/departments/new"
      />

      <Card>
        <CardHeader
          title="لیست دپارتمان‌ها"
          subtitle={`${formatNumber(total)} دپارتمان ثبت شده`}
          icon="fa-solid fa-list"
        />
        <CardBody className="p-0">
          {departments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <i className="fa-solid fa-inbox text-2xl" />
              </div>
              <p className="text-sm text-slate-500">هنوز دپارتمانی ثبت نشده است</p>
              <Link
                href="/departments/new"
                className="mt-4 text-sm font-medium text-slate-800 hover:underline"
              >
                اولین دپارتمان را ایجاد کنید
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                    <th className="px-5 py-4 font-medium">نام</th>
                    <th className="px-5 py-4 font-medium">مدیر</th>
                    <th className="px-5 py-4 font-medium">تلفن</th>
                    <th className="px-5 py-4 font-medium">گردش کارها</th>
                    <th className="px-5 py-4 font-medium">وضعیت</th>
                    <th className="px-5 py-4 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <Link
                          href={`/departments/${dept.id}`}
                          className="font-medium text-slate-800 transition hover:text-slate-600"
                        >
                          <i className="fa-solid fa-building-columns ml-2 text-slate-300" />
                          {dept.name}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {dept.managerName || "—"}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500" dir="ltr">
                        {dept.phone || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone="blue">
                          <i className="fa-solid fa-diagram-project" />
                          {formatNumber(dept._count.workflows)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        {dept.isActive ? (
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
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/departments/${dept.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                            title="مشاهده"
                          >
                            <i className="fa-solid fa-eye text-xs" />
                          </Link>
                          <Link
                            href={`/departments/${dept.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                            title="ویرایش"
                          >
                            <i className="fa-solid fa-pen text-xs" />
                          </Link>
                          <DeleteButton
                            id={dept.id}
                            entityName="دپارتمان"
                            endpoint="/api/departments"
                          />
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