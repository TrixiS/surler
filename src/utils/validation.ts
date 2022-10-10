import { z } from "zod";

export const urlInputSchema = z.object({
  name: z
    .string()
    .regex(/^[a-z0-9_]+$/i, {
      message: "Use only English alphabet, numbers and _",
    })
    .trim()
    .min(1, { message: "Name is required" }),
  url: z
    .string()
    .url({ message: "Enter a valid URL" })
    .startsWith("https://", { message: "Enter HTTPS URL" })
    .trim(),
});
