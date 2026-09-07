import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { workflowSchema } from "@/lib/validations";
import { canManageWorkflows } from "@/lib/rbac";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageWorkflows(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { id } = await params;
  const workflow = await prisma.workflow.findUnique({
    where: { id: parseInt(id) },
    include: {
      department: true,
      creator: { select: { id: true, name: true, email: true } },
      steps: {
        orderBy: { order: "asc" },
        include: { assignee: { select: { id: true, name: true, email: true } } },
      },
      tasks: {
        orderBy: { createdAt: "desc" },
        include: { assignee: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!workflow) {
    return NextResponse.json({ error: "گردش کار یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(workflow);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageWorkflows(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = workflowSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path[0]?.toString() || "form";
        if (!fieldErrors[path]) fieldErrors[path] = err.message;
      });
      return NextResponse.json({ errors: fieldErrors }, { status: 400 });
    }

    const existing = await prisma.workflow.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "گردش کار یافت نشد" }, { status: 404 });
    }

    const workflow = await prisma.workflow.update({
      where: { id: parseInt(id) },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        departmentId: parsed.data.departmentId,
        status: parsed.data.status,
        priority: parsed.data.priority,
        startDate: parsed.data.startDate,
        dueDate: parsed.data.dueDate,
      },
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("Update workflow error:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی گردش کار" }, { status: 500 });
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
  if (!canManageWorkflows(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.workflow.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "گردش کار یافت نشد" }, { status: 404 });
    }

    await prisma.workflow.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "گردش کار حذف شد" });
  } catch (error) {
    console.error("Delete workflow error:", error);
    return NextResponse.json({ error: "خطا در حذف گردش کار" }, { status: 500 });
  }
}