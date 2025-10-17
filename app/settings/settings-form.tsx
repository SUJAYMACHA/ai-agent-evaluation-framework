"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface SettingsFormProps {
  initialSettings: any;
  userId: string;
}

export default function SettingsForm({ initialSettings, userId }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [runPolicy, setRunPolicy] = useState(initialSettings?.run_policy || "always");
  const [sampleRatePct, setSampleRatePct] = useState(initialSettings?.sample_rate_pct || 100);
  const [obfuscatePii, setObfuscatePii] = useState(initialSettings?.obfuscate_pii || false);
  const [maxEvalPerDay, setMaxEvalPerDay] = useState(initialSettings?.max_eval_per_day || 1000);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const settingsData = {
        user_id: userId,
        run_policy: runPolicy,
        sample_rate_pct: sampleRatePct,
        obfuscate_pii: obfuscatePii,
        max_eval_per_day: maxEvalPerDay,
      };

      if (initialSettings) {
        // Update existing settings
        const { error } = await supabase
          .from("evaluation_settings")
          .update(settingsData)
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from("evaluation_settings")
          .insert(settingsData);

        if (error) throw error;
      }

      setMessage({ type: "success", text: "Settings saved successfully!" });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Evaluation Settings
        </h1>
        <p className="text-muted-foreground">
          Configure how your AI agent evaluations are processed
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings Configuration</CardTitle>
          <CardDescription>
            Manage evaluation policies, sampling rates, and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="runPolicy">Run Policy</Label>
              <Select value={runPolicy} onValueChange={setRunPolicy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Always Run</SelectItem>
                  <SelectItem value="sampled">Sampled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose when to run evaluations: always or based on sampling
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sampleRatePct">Sample Rate (%)</Label>
              <Input
                id="sampleRatePct"
                type="number"
                min="0"
                max="100"
                value={sampleRatePct}
                onChange={(e) => setSampleRatePct(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Percentage of evaluations to process (0-100)
              </p>
            </div>

            <div className="flex items-center justify-between space-y-2">
              <div className="space-y-0.5">
                <Label htmlFor="obfuscatePii">Obfuscate PII</Label>
                <p className="text-sm text-muted-foreground">
                  Hide personally identifiable information in prompts and responses
                </p>
              </div>
              <Switch
                id="obfuscatePii"
                checked={obfuscatePii}
                onCheckedChange={setObfuscatePii}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEvalPerDay">Max Evaluations Per Day</Label>
              <Input
                id="maxEvalPerDay"
                type="number"
                min="0"
                value={maxEvalPerDay}
                onChange={(e) => setMaxEvalPerDay(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of evaluations to process per day
              </p>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
