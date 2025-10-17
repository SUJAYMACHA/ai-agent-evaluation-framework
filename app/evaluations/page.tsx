import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/navigation";
import EvaluationsTable from "./evaluations-table";
import { generateMockEvaluations } from "@/lib/mock-data";
import { MockDataAlert } from "@/components/mock-data-alert";

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
  
  // If no real data, use mock data
  const useMockData = !evaluations || evaluations.length === 0;
  const mockData = useMockData ? generateMockEvaluations() : [];
  const mockCount = useMockData ? mockData.length : 0;
  
  // Paginate mock data
  const paginatedMockData = useMockData 
    ? mockData.slice(from, to + 1)
    : [];

  const totalPages = useMockData 
    ? Math.ceil(mockCount / pageSize) 
    : (count ? Math.ceil(count / pageSize) : 0);
    
  const displayData = useMockData ? paginatedMockData : evaluations || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-6">
        {useMockData && <MockDataAlert />}
        <EvaluationsTable
          evaluations={displayData}
          currentPage={page}
          totalPages={totalPages}
          totalCount={useMockData ? mockCount : (count || 0)}
        />
      </main>
    </div>
  );
}
