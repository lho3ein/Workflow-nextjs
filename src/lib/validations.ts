import { z } from "zod";

export const departmentSchema = z.object({
   name: z.string().min(1, "نام الزامی است").max(255, "نام حداکثر ۲۵۵ کاراکتر می‌تواند باشد"),
   description: z.string().nullable().optional(),
   managerName: z.string().nullable().optional(),
   phone: z.string().nullable().optional(),
   email: z.string().email("ایمیل معتبر نیست").nullable().optional(),
   isActive: z.boolean().default(true),
});

export const workflowSchema = z
   .object({
      title: z.string().min(1, "عنوان الزامی است").max(255, "عنوان حداکثر ۲۵۵ کاراکتر می‌تواند باشد"),
      description: z.string().nullable().optional(),
      departmentId: z.coerce.number().int().positive("دپارتمان الزامی است"),
      status: z.enum(["active", "inactive", "archived"]).default("active"),
      priority: z.coerce.number().int().min(1, "اولویت باید بین ۱ تا ۴ باشد").max(4, "اولویت باید بین ۱ تا ۴ باشد").default(1),
      startDate: z
         .string()
         .regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ معتبر نیست")
         .nullable()
         .optional()
         .transform((v) => (v ? new Date(v + "T00:00:00") : null)),
      dueDate: z
         .string()
         .regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ معتبر نیست")
         .nullable()
         .optional()
         .transform((v) => (v ? new Date(v + "T00:00:00") : null)),
   })
   .refine(
      (data) => {
         if (data.startDate && data.dueDate) {
            return data.dueDate > data.startDate;
         }
         return true;
      },
      {
         message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
         path: ["dueDate"],
      },
   );

export const taskSchema = z.object({
   title: z.string().min(1, "عنوان الزامی است").max(255, "عنوان حداکثر ۲۵۵ کاراکتر می‌تواند باشد"),
   description: z.string().nullable().optional(),
   workflowId: z.coerce.number().int().positive("گردش کار الزامی است"),
   workflowStepId: z.coerce.number().int().positive("مرحله گردش کار الزامی است"),
   assignedTo: z.coerce.number().int().positive().nullable().optional(),
   status: z.enum(["pending", "in_progress", "completed", "rejected", "on_hold"]).default("pending"),
   priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
   dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ معتبر نیست")
      .nullable()
      .optional()
      .transform((v) => (v ? new Date(v + "T00:00:00") : null)),
   estimatedHours: z.coerce.number().int().min(1, "ساعت تخمینی باید حداقل ۱ باشد").nullable().optional(),
});

export const registerSchema = z
   .object({
      name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(255, "نام حداکثر ۲۵۵ کاراکتر می‌تواند باشد"),
      email: z.string().email("ایمیل معتبر نیست"),
      password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد").max(255, "رمز عبور حداکثر ۲۵۵ کاراکتر می‌تواند باشد"),
      password_confirmation: z.string(),
   })
   .refine((data) => data.password === data.password_confirmation, {
      message: "تایید رمز عبور با رمز عبور مطابقت ندارد",
      path: ["password_confirmation"],
   });

export type DepartmentInput = z.infer<typeof departmentSchema>;
export type WorkflowInput = z.infer<typeof workflowSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
