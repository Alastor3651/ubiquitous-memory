import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-() .]+$/, "Enter a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
});

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(150),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-() .]+$/, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Location is required").max(150),
  amountRequested: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be greater than zero")
    .max(100_000_000, "Amount is too large"),
  purpose: z.string().trim().min(20, "Please describe the purpose in at least 20 characters").max(5000),
  additionalInfo: z.string().trim().max(5000).optional().or(z.literal("")),
});

export const noteSchema = z.object({
  content: z.string().trim().min(1, "Note cannot be empty").max(2000),
});

export const statusSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"]),
});

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
