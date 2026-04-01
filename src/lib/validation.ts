/**
 * validation.ts — Centralized Zod schemas for all form inputs.
 * Provides consistent validation rules and error messages across the app.
 */
import { z } from "zod";

/* ── Auth schemas ─────────────────────────────────────────── */

/** Login form validation */
export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be under 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be under 100 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Signup base fields */
const signupBase = z.object({
  username: loginSchema.shape.username,
  password: loginSchema.shape.password,
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  role: z.enum(["mentor", "student"], { required_error: "Please select a role" }),
});

/** Mentor-specific signup fields */
export const mentorSignupSchema = signupBase.extend({
  role: z.literal("mentor"),
  field: z.string().min(1, "Please select a field"),
  experience: z.string().max(200, "Experience must be under 200 characters").optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
});

/** Student-specific signup fields */
export const studentSignupSchema = signupBase.extend({
  role: z.literal("student"),
  age: z.coerce.number().int().min(5, "Age must be at least 5").max(25, "Age must be under 25"),
  interests: z.string().max(200, "Interests must be under 200 characters").optional(),
  goals: z.string().max(500, "Goals must be under 500 characters").optional(),
  background: z.string().max(500, "Background must be under 500 characters").optional(),
});

/** Discriminated union for signup — validates based on role */
export const signupSchema = z.discriminatedUnion("role", [mentorSignupSchema, studentSignupSchema]);

export type SignupInput = z.infer<typeof signupSchema>;

/* ── Chat schema ──────────────────────────────────────────── */

/** Chat message validation — prevents empty, oversized, or malicious input */
export const chatMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be under 1000 characters"),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

/* ── Support request schema ───────────────────────────────── */

export const supportRequestSchema = z.object({
  programId: z.string().min(1, "Program is required"),
  note: z.string().max(500, "Note must be under 500 characters").optional(),
});

export type SupportRequestInput = z.infer<typeof supportRequestSchema>;
