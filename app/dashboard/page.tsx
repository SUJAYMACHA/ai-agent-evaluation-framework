import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/navigation";
import DashboardContent from "./dashboard-content";
import { generateMockEvaluations } from "@/lib/mock-data";
import { MockDataAlert } from "@/components/mock-data-alert";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch evaluations data for the dashboard
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: evaluations, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching evaluations:", error);
  }

  // If no real data, use mock data
  const useMockData = !evaluations || evaluations.length === 0;
  const displayData = useMockData 
    ? generateMockEvaluations() 
    : evaluations;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-6">
        {useMockData && <MockDataAlert />}
        <DashboardContent evaluations={displayData} />
      </main>
    </div>
  );
}
