import { redirect } from "next/navigation";

export default async function SpaceAlias({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/spaces/${slug}`);
}
