import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { departmentSchema } from "@/lib/validations";
import { canManageDepartments } from "@/lib/rbac";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageDepartments(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { id } = await params;
  const department = await prisma.department.findUnique({
    where: { id: parseInt(id) },
    include: {
      workflows: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { tasks: true, steps: true } } },
      },
      _count: { select: { workflows: true } },
    },
  });

  if (!department) {
    return NextResponse.json({ error: "دپارتمان یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(department);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageDepartments(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { id } = await params;
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

    const existing = await prisma.department.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "دپارتمان یافت نشد" }, { status: 404 });
    }

    const department = await prisma.department.update({
      where: { id: parseInt(id) },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        managerName: parsed.data.managerName || null,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        isActive: parsed.data.isActive ?? existing.isActive,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Update department error:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی دپارتمان" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageDepartments(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.department.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "دپارتمان یافت نشد" }, { status: 404 });
    }

    await prisma.department.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "دپارتمان حذف شد" });
  } catch (error) {
    console.error("Delete department error:", error);
    return NextResponse.json({ error: "خطا در حذف دپارتمان" }, { status: 500 });
  }
}