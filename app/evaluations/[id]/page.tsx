import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/navigation";
import EvaluationDetail from "./evaluation-detail";
import { generateMockEvaluations } from "@/lib/mock-data";
import { MockDataAlert } from "@/components/mock-data-alert";

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

  // If no real evaluation found and the ID starts with 'mock-', generate mock data
  let mockEvaluation = null;
  if ((error || !evaluation) && params.id.startsWith('mock-')) {
    // Generate a specific mock evaluation based on ID
    mockEvaluation = {
      id: params.id,
      interaction_id: `int-${params.id.substring(5, 15)}`,
      prompt: "Create a responsive navigation menu with CSS and JavaScript",
      response: "Here's a responsive navigation menu implementation:\n\n```html\n<nav class=\"navbar\">\n  <div class=\"brand\">My Site</div>\n  <div class=\"hamburger\">\n    <div class=\"bar\"></div>\n    <div class=\"bar\"></div>\n    <div class=\"bar\"></div>\n  </div>\n  <ul class=\"nav-menu\">\n    <li><a href=\"#\">Home</a></li>\n    <li><a href=\"#\">About</a></li>\n    <li><a href=\"#\">Services</a></li>\n    <li><a href=\"#\">Contact</a></li>\n  </ul>\n</nav>\n```\n\n```css\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background-color: #333;\n  color: white;\n}\n\n.nav-menu {\n  display: flex;\n  list-style: none;\n}\n\n.nav-menu li {\n  margin-left: 2rem;\n}\n\n.nav-menu a {\n  color: white;\n  text-decoration: none;\n}\n\n.hamburger {\n  display: none;\n  cursor: pointer;\n}\n\n.bar {\n  width: 25px;\n  height: 3px;\n  margin: 5px;\n  background-color: white;\n}\n\n@media (max-width: 768px) {\n  .hamburger {\n    display: block;\n  }\n  \n  .nav-menu {\n    position: fixed;\n    top: 60px;\n    right: -100%;\n    flex-direction: column;\n    background-color: #333;\n    width: 100%;\n    text-align: center;\n    transition: 0.3s;\n  }\n  \n  .nav-menu.active {\n    right: 0;\n  }\n  \n  .nav-menu li {\n    margin: 1rem 0;\n  }\n}\n```\n\n```javascript\ndocument.querySelector('.hamburger').addEventListener('click', () => {\n  document.querySelector('.nav-menu').classList.toggle('active');\n});\n```\n\nThis implementation provides a responsive navigation menu that collapses into a hamburger menu on smaller screens. The JavaScript toggles the visibility of the menu when the hamburger icon is clicked.",
      score: 4.8,
      latency_ms: 1250,
      flags: [],
      pii_tokens_redacted: 0,
      created_at: new Date().toISOString(),
    };
  }

  if (error || !evaluation) {
    if (!mockEvaluation) {
      redirect("/evaluations");
    }
  }

  // Fetch user settings to check obfuscate_pii
  const { data: settings } = await supabase
    .from("evaluation_settings")
    .select("obfuscate_pii")
    .eq("user_id", user.id)
    .single();

  const obfuscatePii = settings?.obfuscate_pii || false;
  
  // Use either the real evaluation or mock evaluation
  const displayEvaluation = evaluation || mockEvaluation;

  const isMockData = !evaluation && mockEvaluation;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-6">
        {isMockData && <MockDataAlert />}
        <EvaluationDetail evaluation={displayEvaluation} obfuscatePii={obfuscatePii} />
      </main>
    </div>
  );
}
