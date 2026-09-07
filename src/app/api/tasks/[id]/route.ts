import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations";
import { canManageTasks } from "@/lib/rbac";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageTasks(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { id } = await params;
  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
    include: {
      workflow: { include: { department: true } },
      workflowStep: true,
      assignee: { select: { id: true, name: true, email: true } },
      creator: { select: { id: true, name: true, email: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      assignments: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "تسک یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageTasks(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path[0]?.toString() || "form";
        if (!fieldErrors[path]) fieldErrors[path] = err.message;
      });
      return NextResponse.json({ errors: fieldErrors }, { status: 400 });
    }

    const existing = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "تسک یافت نشد" }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        workflowId: parsed.data.workflowId,
        workflowStepId: parsed.data.workflowStepId,
        assignedTo: parsed.data.assignedTo || null,
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueDate: parsed.data.dueDate,
        estimatedHours: parsed.data.estimatedHours || null,
        startedAt:
          parsed.data.status === "in_progress" && !existing.startedAt
            ? new Date()
            : existing.startedAt,
        completedAt:
          parsed.data.status === "completed"
            ? new Date()
            : null,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی تسک" }, { status: 500 });
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
  if (!canManageTasks(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "تسک یافت نشد" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "تسک حذف شد" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: "خطا در حذف تسک" }, { status: 500 });
  }
}