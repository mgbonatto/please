import { redirect } from "next/navigation";

export default async function IssueAlias({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s?: string }>;
}) {
  const { id } = await params;
  const { s } = await searchParams;
  redirect(`/issues/${id}${s ? `?s=${s}` : ""}`);
}
