import * as z from "zod";

export const personaFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  type: z.enum([
    "AI_VOCALIST",
    "AI_WRITER",
    "AI_INSTRUMENTALIST",
    "AI_CHARACTER",
    "AI_MIXER",
    "AI_EFFECT",
    "AI_SOUND",
    "AI_PRODUCER",
    "AI_COMPOSER",
    "AI_ARRANGER",
    "AI_DJ",
    "AI_VISUAL_ARTIST",
    "AI_AUDIO_ENGINEER",
    "AI_MASTERING",
    "AI_MIX"
  ] as const),
  subtype: z.string().nullable().optional(),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  avatar_url: z.string().url("Please provide a valid URL").optional(),
  avatar_position: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100)
  }).default({ x: 50, y: 50 }),
  banner_url: z.string().url("Please provide a valid URL").optional(),
  banner_position: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100)
  }).default({ x: 50, y: 50 }),
  video_url: z.string().url("Please provide a valid URL").optional(),
  audio_preview_url: z.string().url("Please provide a valid URL").optional(),
  banner_darkness: z.number().min(0).max(100).default(50),
  age: z.string().optional(),
  style: z.string()
    .min(2, "Style must be at least 2 characters")
    .max(100, "Style cannot exceed 100 characters")
    .optional(),
  voice_type: z.string()
    .min(2, "Voice type must be at least 2 characters")
    .max(50, "Voice type cannot exceed 50 characters")
    .refine(val => val !== undefined, "Voice type is required for AI vocalists")
    .optional(),
  vocal_style: z.string()
    .min(2, "Vocal style must be at least 2 characters")
    .max(100, "Vocal style cannot exceed 100 characters")
    .refine(val => val !== undefined, "Vocal style is required for AI vocalists")
    .optional(),
  voice_model: z.object({
    id: z.string().min(1, "Voice model must be selected"),
    name: z.string().min(1, "Voice model name is required"),
    parameters: z.object({
      pitch: z.number().min(-12).max(12).default(0),
      speed: z.number().min(0.5).max(2.0).default(1.0),
      energy: z.number().min(0).max(2.0).default(1.0),
      clarity: z.number().min(0).max(1.0).default(0.75)
    })
  }).optional().superRefine((val, ctx) => {
    if (ctx.parent.type === "AI_VOCALIST" && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Voice model is required for AI vocalists"
      });
    }
  }),
  artist_category: z.string()
    .min(2, "Artist category must be at least 2 characters")
    .max(50, "Artist category cannot exceed 50 characters")
    .optional(),
  is_public: z.boolean().default(false),
  id: z.string().optional(),
});

export type PersonaFormValues = z.infer<typeof personaFormSchema>;

export const personaGeneratorSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  gender: z.string()
    .min(1, "Please select a gender")
    .max(50, "Gender cannot exceed 50 characters"),
  emotionalProfile: z.string()
    .min(10, "Emotional profile must be at least 10 characters")
    .max(500, "Emotional profile cannot exceed 500 characters"),
  lyricalPreferences: z.string()
    .min(10, "Lyrical preferences must be at least 10 characters")
    .max(500, "Lyrical preferences cannot exceed 500 characters"),
  influences: z.string()
    .min(2, "Influences must be at least 2 characters")
    .max(200, "Influences cannot exceed 200 characters"),
  language: z.string()
    .min(2, "Language must be at least 2 characters")
    .max(50, "Language cannot exceed 50 characters"),
  voiceType: z.string()
    .min(2, "Voice type must be at least 2 characters")
    .max(50, "Voice type cannot exceed 50 characters"),
  musicGenres: z.string()
    .min(2, "Music genres must be at least 2 characters")
    .max(200, "Music genres cannot exceed 200 characters"),
  artistImageUrl: z.string().url("Please provide a valid URL").optional(),
  voiceSampleUrl: z.string().url("Please provide a valid URL").optional(),
});

export type PersonaGeneratorValues = z.infer<typeof personaGeneratorSchema>;