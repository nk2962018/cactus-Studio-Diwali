import { Catalogue } from "@/components/catalogue";

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const params = await searchParams;
  return <Catalogue key={`${params.category ?? "Plants"}-${params.search ?? ""}`} initialCategory={params.category} initialSearch={params.search} />;
}