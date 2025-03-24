import * as z from "zod"

export const profileFormSchema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters").max(50, "Display name cannot exceed 50 characters"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  is_public: z.boolean().default(true),
  banner_position: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100)
  }).default({ x: 50, y: 50 }),
  darkness_factor: z.number().min(0).max(100).default(50),
  video_url: z.string().url("Please enter a valid URL").optional(),
  banner_url: z.string().url("Please enter a valid URL").optional(),
  avatar_url: z.string().url("Please enter a valid URL").optional(),
  genre: z.array(z.string()).default([]),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional(),
  profile_type: z.enum(["musician", "writer", "mixer"]).default("musician"),
  audio_preview_url: z.string().url("Please enter a valid URL").optional(),
  audio_trim_start: z.number().optional(),
  audio_trim_end: z.number().optional(),
  social_links: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url("Please enter a valid URL"),
      id: z.string()
    })
  ).default([])
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>