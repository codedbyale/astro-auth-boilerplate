import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const pages = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
	}),
});

export const collections = {
	pages,
};
