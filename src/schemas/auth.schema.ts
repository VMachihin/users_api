import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  birthDate: z.iso.datetime(),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
