import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/navigation";
import EvaluationDetail from "./evaluation-detail";

export default async function EvaluationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the specific evaluation
  const { data: evaluation, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !evaluation) {
    redirect("/evaluations");
  }

  // Fetch user settings to check obfuscate_pii
  const { data: settings } = await supabase
    .from("evaluation_settings")
    .select("obfuscate_pii")
    .eq("user_id", user.id)
    .single();

  const obfuscatePii = settings?.obfuscate_pii || false;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-6">
        <EvaluationDetail evaluation={evaluation} obfuscatePii={obfuscatePii} />
      </main>
    </div>
  );
}
