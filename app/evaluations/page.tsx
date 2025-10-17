import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/navigation";
import EvaluationsTable from "./evaluations-table";

export default async function EvaluationsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const page = parseInt(searchParams.page || "1");
  const pageSize = 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch evaluations with pagination
  const { data: evaluations, error, count } = await supabase
    .from("evaluations")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching evaluations:", error);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-6">
        <EvaluationsTable
          evaluations={evaluations || []}
          currentPage={page}
          totalPages={totalPages}
          totalCount={count || 0}
        />
      </main>
    </div>
  );
}
