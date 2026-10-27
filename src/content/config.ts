import { defineCollection, z } from 'astro:content';

const advisories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    vendor: z.string(),
    product: z.string().optional(),
    class: z.string(),
    severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Info']),
    status: z.enum(['Draft', 'Reported', 'Triaged', 'Fixed', 'Disclosed']),
    date: z.coerce.date(),
    cve: z.string().optional(),
    identifier: z.string().optional(),
    link: z.string().url().optional(),
    summary: z.string(),
    lede: z.string().optional(),
    cvss: z
      .array(z.object({ cve: z.string().optional(), version: z.string(), score: z.number(), vector: z.string() }))
      .optional(),
  }),
});

export const collections = { advisories };
