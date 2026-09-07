import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations";
import { canManageTasks } from "@/lib/rbac";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageTasks(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const perPage = 10;

  const total = await prisma.task.count();
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      workflow: { select: { id: true, title: true } },
      workflowStep: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ tasks, total, page, totalPages: Math.ceil(total / perPage) });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageTasks(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
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

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        workflowId: parsed.data.workflowId,
        workflowStepId: parsed.data.workflowStepId,
        assignedTo: parsed.data.assignedTo || null,
        createdById: parseInt(session.user.id),
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueDate: parsed.data.dueDate,
        estimatedHours: parsed.data.estimatedHours || null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "خطا در ایجاد تسک" }, { status: 500 });
  }
}