import { serverSupabaseClient } from "#supabase/server";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const query = getQuery(event);

  const schema = z.object({
    models: z.string().transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  });

  const result = schema.safeParse(query);
  if (!result.success || result.data.models.length === 0) {
    return [];
  }

  const { data, error } = await client
    .from("models")
    .select("*")
    .in("slug", result.data.models);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Model selection in database failed",
      data: error,
    });
  }
  return data;
});
