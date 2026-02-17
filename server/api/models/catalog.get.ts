import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from("models")
    .select("id, slug, brand, name")
    .order("brand", { ascending: true });

  if (error) throw createError({ statusCode: 500, message: error.message });

  return data?.map((m) => ({
    id: m.id,
    slug: m.slug,
    label: `${m.brand} ${m.name}`,
    value: String(m.id),
  }));
});
