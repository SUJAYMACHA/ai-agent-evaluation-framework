import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/navigation";
import SettingsForm from "./settings-form";
import { MockDataAlert } from "@/components/mock-data-alert";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch existing settings
  const { data: settings, error } = await supabase
    .from("evaluation_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Create default settings if none exist
  const defaultSettings = {
    run_policy: "always",
    sample_rate_pct: 100,
    obfuscate_pii: true,
    max_eval_per_day: 1000
  };

  const displaySettings = settings || defaultSettings;
  const useMockData = !settings;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-6">
        {useMockData && <MockDataAlert />}
        <SettingsForm initialSettings={displaySettings} userId={user.id} />
      </main>
    </div>
  );
}
