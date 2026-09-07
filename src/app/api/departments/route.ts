import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { departmentSchema } from "@/lib/validations";
import { canManageDepartments } from "@/lib/rbac";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageDepartments(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const perPage = 10;

  const total = await prisma.department.count();
  const departments = await prisma.department.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      _count: { select: { workflows: true } },
    },
  });

  return NextResponse.json({ departments, total, page, totalPages: Math.ceil(total / perPage) });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageDepartments(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = departmentSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path[0]?.toString() || "form";
        if (!fieldErrors[path]) fieldErrors[path] = err.message;
      });
      return NextResponse.json({ errors: fieldErrors }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        managerName: parsed.data.managerName || null,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        isActive: parsed.data.isActive ?? true,
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error("Create department error:", error);
    return NextResponse.json({ error: "خطا در ایجاد دپارتمان" }, { status: 500 });
  }
}