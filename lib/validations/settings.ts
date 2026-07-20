import { z } from "zod";

export const settingsSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  theme: z.enum(["light", "dark", "system"], {
    message: "Please select a valid theme",
  }),
  notifications: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
