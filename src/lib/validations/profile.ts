import * as z from &ldquo;zod&rdquo;;

export const profileFormSchema = z.object({
  firstName: z.string().min(2, &ldquo;First name must be at least 2 characters&rdquo;).max(30).optional().nullable(),
  lastName: z.string().min(2, &ldquo;Last name must be at least 2 characters&rdquo;).max(30).optional().nullable(),
  avatarUrl: z
    .custom<FileList>()
    .optional()
    .nullable()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 2 * 1024 * 1024,
      &ldquo;Image must be less than 2MB&rdquo;
    ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>; 