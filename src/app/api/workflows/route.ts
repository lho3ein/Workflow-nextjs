import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { workflowSchema } from "@/lib/validations";
import { canManageWorkflows } from "@/lib/rbac";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageWorkflows(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const perPage = 10;

  const total = await prisma.workflow.count();
  const workflows = await prisma.workflow.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      department: true,
      creator: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true, steps: true } },
    },
  });

  return NextResponse.json({ workflows, total, page, totalPages: Math.ceil(total / perPage) });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (!canManageWorkflows(session.user.role)) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
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

    const data = {
      title: parsed.data.title,
      description: parsed.data.description || null,
      departmentId: parsed.data.departmentId,
      createdById: parseInt(session.user.id),
      status: parsed.data.status,
      priority: parsed.data.priority,
      startDate: parsed.data.startDate,
      dueDate: parsed.data.dueDate,
    };

    const workflow = await prisma.workflow.create({ data });

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error("Create workflow error:", error);
    return NextResponse.json({ error: "خطا در ایجاد گردش کار" }, { status: 500 });
  }
}