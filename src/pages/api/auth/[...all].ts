import type { APIRoute } from "astro";
import { auth } from "@/shared/api/auth/server";

export const ALL: APIRoute = async ({ request }) => auth.handler(request);
