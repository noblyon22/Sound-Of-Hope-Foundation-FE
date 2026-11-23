import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .refine((v) => /[A-Z]/.test(v), "Must contain at least one uppercase letter")
  .refine((v) => /[a-z]/.test(v), "Must contain at least one lowercase letter")
  .refine((v) => /\d/.test(v), "Must contain at least one digit");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name is too long"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name is too long"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().optional().or(z.literal("")),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    new_password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.new_password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.new_password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
