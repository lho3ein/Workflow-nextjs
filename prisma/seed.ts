import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clean existing data (in reverse dependency order)
  await prisma.taskComment.deleteMany();
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.workflowStep.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  // ============ USERS ============
  const password = await bcrypt.hash("password", 12);

  const admin = await prisma.user.create({
    data: {
      name: "مدیر سیستم",
      email: "admin@workflow.com",
      password,
      role: "admin",
      isActive: true,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "مدیر دپارتمان",
      email: "manager@workflow.com",
      password,
      role: "manager",
      isActive: true,
    },
  });

  const _supervisor = await prisma.user.create({
    data: {
      name: "سرپرست",
      email: "supervisor@workflow.com",
      password,
      role: "supervisor",
      isActive: true,
    },
  });

  const _regularUser = await prisma.user.create({
    data: {
      name: "کاربر عادی",
      email: "user@workflow.com",
      password,
      role: "user",
      isActive: true,
    },
  });

  // Additional users referenced by tasks
  const ahmad = await prisma.user.create({
    data: {
      name: "احمد محمدی",
      email: "ahmad@company.com",
      password,
      role: "manager",
      isActive: true,
    },
  });

  const fateme = await prisma.user.create({
    data: {
      name: "فاطمه احمدی",
      email: "fateme@company.com",
      password,
      role: "supervisor",
      isActive: true,
    },
  });

  const ali = await prisma.user.create({
    data: {
      name: "علی رضایی",
      email: "ali@company.com",
      password,
      role: "user",
      isActive: true,
    },
  });

  const maryam = await prisma.user.create({
    data: {
      name: "مریم کریمی",
      email: "maryam@company.com",
      password,
      role: "user",
      isActive: true,
    },
  });

  console.log("✓ 8 users created");

  // ============ DEPARTMENTS ============
  const it = await prisma.department.create({
    data: {
      name: "فناوری اطلاعات",
      description: "مدیریت سیستم‌های کامپیوتری و شبکه",
      managerName: "مهندس احمد محمدی",
      phone: "021-12345678",
      email: "it@company.com",
      isActive: true,
    },
  });

  const hr = await prisma.department.create({
    data: {
      name: "منابع انسانی",
      description: "مدیریت پرسنل و استخدام",
      managerName: "خانم فاطمه احمدی",
      phone: "021-12345679",
      email: "hr@company.com",
      isActive: true,
    },
  });

  const finance = await prisma.department.create({
    data: {
      name: "مالی و حسابداری",
      description: "مدیریت مالی و حسابداری شرکت",
      managerName: "آقای علی رضایی",
      phone: "021-12345680",
      email: "finance@company.com",
      isActive: true,
    },
  });

  const sales = await prisma.department.create({
    data: {
      name: "فروش و بازاریابی",
      description: "مدیریت فروش و استراتژی‌های بازاریابی",
      managerName: "خانم مریم کریمی",
      phone: "021-12345681",
      email: "sales@company.com",
      isActive: true,
    },
  });

  const _production = await prisma.department.create({
    data: {
      name: "تولید و عملیات",
      description: "مدیریت خط تولید و عملیات روزانه",
      managerName: "مهندس محسن نوری",
      phone: "021-12345682",
      email: "production@company.com",
      isActive: true,
    },
  });

  console.log("✓ 5 departments created");

  // Assign departments to users
  await prisma.user.updateMany({
    where: { id: { in: [ahmad.id, manager.id] } },
    data: { departmentId: it.id },
  });
  await prisma.user.updateMany({
    where: { id: { in: [fateme.id] } },
    data: { departmentId: hr.id },
  });
  await prisma.user.updateMany({
    where: { id: { in: [ali.id] } },
    data: { departmentId: finance.id },
  });
  await prisma.user.updateMany({
    where: { id: { in: [maryam.id] } },
    data: { departmentId: sales.id },
  });

  const today = new Date();
  const daysFromNow = (n: number) => new Date(today.getTime() + n * 24 * 60 * 60 * 1000);

  // ============ WORKFLOWS ============
  // گردش کار تایید درخواست مرخصی
  const leaveWorkflow = await prisma.workflow.create({
    data: {
      title: "تایید درخواست مرخصی",
      description: "فرآیند تایید درخواست‌های مرخصی کارکنان",
      department: { connect: { id: hr.id } },
      creator: { connect: { id: admin.id } },
      status: "active",
      priority: 2,
      startDate: today,
      dueDate: daysFromNow(30),
    },
  });

  const step1 = await prisma.workflowStep.create({
    data: {
      workflowId: leaveWorkflow.id,
      name: "ارسال درخواست",
      description: "کارمند درخواست مرخصی ارسال می‌کند",
      order: 1,
      status: "completed",
      completedAt: daysFromNow(-5),
    },
  });

  const step2 = await prisma.workflowStep.create({
    data: {
      workflowId: leaveWorkflow.id,
      name: "تایید سرپرست مستقیم",
      description: "سرپرست مستقیم درخواست را بررسی می‌کند",
      order: 2,
      assignedTo: ahmad.id,
      status: "in_progress",
      dueDate: daysFromNow(3),
    },
  });

  const step3 = await prisma.workflowStep.create({
    data: {
      workflowId: leaveWorkflow.id,
      name: "تایید مدیر منابع انسانی",
      description: "مدیر منابع انسانی درخواست نهایی را تایید می‌کند",
      order: 3,
      assignedTo: fateme.id,
      status: "pending",
      dueDate: daysFromNow(10),
    },
  });

  // گردش کار خرید تجهیزات
  const itPurchaseWorkflow = await prisma.workflow.create({
    data: {
      title: "خرید تجهیزات IT",
      description: "فرآیند خرید تجهیزات و لوازم فناوری اطلاعات",
      department: { connect: { id: it.id } },
      creator: { connect: { id: ahmad.id } },
      status: "active",
      priority: 3,
      startDate: today,
      dueDate: daysFromNow(45),
    },
  });

  const p1 = await prisma.workflowStep.create({
    data: {
      workflowId: itPurchaseWorkflow.id,
      name: "درخواست خرید",
      description: "کارشناس IT درخواست خرید تجهیزات می‌کند",
      order: 1,
      status: "completed",
      completedAt: daysFromNow(-7),
    },
  });

  const p2 = await prisma.workflowStep.create({
    data: {
      workflowId: itPurchaseWorkflow.id,
      name: "تایید فنی",
      description: "مدیر IT مشخصات فنی را تایید می‌کند",
      order: 2,
      assignedTo: ahmad.id,
      status: "in_progress",
      dueDate: daysFromNow(5),
    },
  });

  const p3 = await prisma.workflowStep.create({
    data: {
      workflowId: itPurchaseWorkflow.id,
      name: "تایید مالی",
      description: "مدیر مالی بودجه را تایید می‌کند",
      order: 3,
      assignedTo: ali.id,
      status: "pending",
      dueDate: daysFromNow(12),
    },
  });

  const p4 = await prisma.workflowStep.create({
    data: {
      workflowId: itPurchaseWorkflow.id,
      name: "تایید نهایی",
      description: "مدیرعامل درخواست نهایی را تایید می‌کند",
      order: 4,
      assignedTo: admin.id,
      status: "pending",
      dueDate: daysFromNow(20),
    },
  });

  // گردش کار گزارش‌گیری ماهانه
  const salesReportWorkflow = await prisma.workflow.create({
    data: {
      title: "گزارش‌گیری ماهانه فروش",
      description: "فرآیند جمع‌آوری و تحلیل گزارش‌های ماهانه فروش",
      department: { connect: { id: sales.id } },
      creator: { connect: { id: maryam.id } },
      status: "active",
      priority: 2,
      startDate: today,
      dueDate: daysFromNow(15),
    },
  });

  const r1 = await prisma.workflowStep.create({
    data: {
      workflowId: salesReportWorkflow.id,
      name: "جمع‌آوری داده‌ها",
      description: "جمع‌آوری داده‌های فروش از مناطق مختلف",
      order: 1,
      assignedTo: maryam.id,
      status: "in_progress",
      dueDate: daysFromNow(7),
    },
  });

  const r2 = await prisma.workflowStep.create({
    data: {
      workflowId: salesReportWorkflow.id,
      name: "تحلیل و بررسی",
      description: "تحلیل داده‌ها و تهیه گزارش تحلیلی",
      order: 2,
      assignedTo: fateme.id,
      status: "pending",
      dueDate: daysFromNow(10),
    },
  });

  const r3 = await prisma.workflowStep.create({
    data: {
      workflowId: salesReportWorkflow.id,
      name: "تایید و ارسال",
      description: "تایید نهایی و ارسال گزارش به مدیریت",
      order: 3,
      assignedTo: admin.id,
      status: "pending",
      dueDate: daysFromNow(13),
    },
  });

  console.log("✓ 3 workflows + 10 steps created");

  // ============ TASKS ============
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: "درخواست مرخصی سالانه",
        description: "درخواست مرخصی سالانه ۵ روزه برای سفر خانوادگی",
        workflowId: leaveWorkflow.id,
        workflowStepId: step1.id,
        assignedTo: ahmad.id,
        createdById: ahmad.id,
        status: "completed",
        priority: "medium",
        dueDate: daysFromNow(7),
        estimatedHours: 2,
        actualHours: 1,
        startedAt: daysFromNow(-6),
        completedAt: daysFromNow(-5),
      },
      {
        title: "بررسی درخواست مرخصی احمد محمدی",
        description: "بررسی و تایید درخواست مرخصی کارمند احمد محمدی",
        workflowId: leaveWorkflow.id,
        workflowStepId: step2.id,
        assignedTo: ahmad.id,
        createdById: admin.id,
        status: "in_progress",
        priority: "medium",
        dueDate: daysFromNow(3),
        estimatedHours: 4,
        startedAt: daysFromNow(-1),
      },
      {
        title: "تایید نهایی درخواست مرخصی",
        description: "تایید نهایی درخواست مرخصی احمد محمدی",
        workflowId: leaveWorkflow.id,
        workflowStepId: step3.id,
        assignedTo: fateme.id,
        createdById: ahmad.id,
        status: "pending",
        priority: "medium",
        dueDate: daysFromNow(6),
        estimatedHours: 2,
      },
      {
        title: "درخواست خرید لپ‌تاپ",
        description: "درخواست خرید ۵ عدد لپ‌تاپ برای کارشناسان IT",
        workflowId: itPurchaseWorkflow.id,
        workflowStepId: p1.id,
        assignedTo: ahmad.id,
        createdById: ahmad.id,
        status: "completed",
        priority: "high",
        dueDate: daysFromNow(10),
        estimatedHours: 8,
        actualHours: 6,
        startedAt: daysFromNow(-9),
        completedAt: daysFromNow(-7),
      },
      {
        title: "بررسی مشخصات فنی لپ‌تاپ‌ها",
        description: "بررسی و تایید مشخصات فنی لپ‌تاپ‌های درخواستی",
        workflowId: itPurchaseWorkflow.id,
        workflowStepId: p2.id,
        assignedTo: ahmad.id,
        createdById: admin.id,
        status: "in_progress",
        priority: "high",
        dueDate: daysFromNow(5),
        estimatedHours: 6,
        startedAt: daysFromNow(-2),
      },
      {
        title: "بررسی بودجه خرید تجهیزات",
        description: "بررسی بودجه و تایید مالی خرید لپ‌تاپ‌ها",
        workflowId: itPurchaseWorkflow.id,
        workflowStepId: p3.id,
        assignedTo: ali.id,
        createdById: ahmad.id,
        status: "pending",
        priority: "high",
        dueDate: daysFromNow(8),
        estimatedHours: 4,
      },
      {
        title: "تایید نهایی خرید تجهیزات",
        description: "تایید نهایی خرید لپ‌تاپ‌ها توسط مدیریت",
        workflowId: itPurchaseWorkflow.id,
        workflowStepId: p4.id,
        assignedTo: admin.id,
        createdById: ahmad.id,
        status: "pending",
        priority: "critical",
        dueDate: daysFromNow(15),
        estimatedHours: 2,
      },
      {
        title: "جمع‌آوری گزارش‌های فروش مناطق",
        description: "جمع‌آوری گزارش‌های فروش از ۸ منطقه مختلف",
        workflowId: salesReportWorkflow.id,
        workflowStepId: r1.id,
        assignedTo: maryam.id,
        createdById: maryam.id,
        status: "in_progress",
        priority: "medium",
        dueDate: daysFromNow(7),
        estimatedHours: 12,
        startedAt: daysFromNow(-3),
      },
      {
        title: "تحلیل داده‌های فروش ماهانه",
        description: "تحلیل و بررسی روند فروش و تهیه گزارش تحلیلی",
        workflowId: salesReportWorkflow.id,
        workflowStepId: r2.id,
        assignedTo: fateme.id,
        createdById: maryam.id,
        status: "pending",
        priority: "medium",
        dueDate: daysFromNow(10),
        estimatedHours: 8,
      },
      {
        title: "تایید و ارسال گزارش نهایی",
        description: "تایید نهایی گزارش و ارسال به هیئت مدیره",
        workflowId: salesReportWorkflow.id,
        workflowStepId: r3.id,
        assignedTo: admin.id,
        createdById: maryam.id,
        status: "pending",
        priority: "high",
        dueDate: daysFromNow(12),
        estimatedHours: 4,
      },
    ],
  });

  console.log(`✓ ${tasks.count} tasks created`);

  // ============ TASK COMMENTS ============
  const comments = [
    { taskTitle: "درخواست مرخصی سالانه", userId: ahmad.id, comment: "درخواست مرخصی برای سفر خانوادگی ثبت شد.", isInternal: false },
    { taskTitle: "بررسی درخواست مرخصی احمد محمدی", userId: admin.id, comment: "مدارک تکمیل است، در انتظار تایید سرپرست.", isInternal: false },
    { taskTitle: "بررسی مشخصات فنی لپ‌تاپ‌ها", userId: ahmad.id, comment: "مشخصات فنی نهایی ارسال شد، منتظر تایید مالی.", isInternal: true },
    { taskTitle: "جمع‌آوری گزارش‌های فروش مناطق", userId: maryam.id, comment: "گزارش ۵ منطقه جمع‌آوری شده، ۳ منطقه باقی مانده است.", isInternal: false },
  ];

  for (const c of comments) {
    const task = await prisma.task.findFirst({ where: { title: c.taskTitle } });
    if (task) {
      await prisma.taskComment.create({
        data: {
          taskId: task.id,
          userId: c.userId,
          comment: c.comment,
          isInternal: c.isInternal,
        },
      });
    }
  }

  console.log("✓ comments created");

  console.log("\nSeed complete!");
  console.log("\nDemo accounts:");
  console.log("  admin@workflow.com / password  (admin)");
  console.log("  manager@workflow.com / password  (manager)");
  console.log("  supervisor@workflow.com / password  (supervisor)");
  console.log("  user@workflow.com / password  (user)");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
