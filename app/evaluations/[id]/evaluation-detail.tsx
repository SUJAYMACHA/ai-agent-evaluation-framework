"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { obfuscateText, formatDate } from "@/lib/utils";

interface Evaluation {
  id: string;
  interaction_id: string;
  prompt: string;
  response: string;
  score: number;
  latency_ms: number;
  flags: string[];
  pii_tokens_redacted: number;
  created_at: string;
}

interface EvaluationDetailProps {
  evaluation: Evaluation;
  obfuscatePii: boolean;
}

export default function EvaluationDetail({
  evaluation,
  obfuscatePii,
}: EvaluationDetailProps) {
  const displayPrompt = obfuscatePii ? obfuscateText(evaluation.prompt) : evaluation.prompt;
  const displayResponse = obfuscatePii ? obfuscateText(evaluation.response) : evaluation.response;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/evaluations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Evaluations
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluation Details</h1>
        <p className="text-muted-foreground">
          Interaction ID: {evaluation.interaction_id}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Score</div>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    evaluation.score >= 0.8
                      ? "bg-green-100 text-green-700"
                      : evaluation.score >= 0.5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {evaluation.score.toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Latency</div>
              <div className="mt-1 text-lg font-semibold">{evaluation.latency_ms}ms</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">PII Tokens Redacted</div>
              <div className="mt-1 text-lg font-semibold">{evaluation.pii_tokens_redacted}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Created At</div>
              <div className="mt-1 text-lg font-semibold">{formatDate(evaluation.created_at)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flags</CardTitle>
          </CardHeader>
          <CardContent>
            {evaluation.flags && Array.isArray(evaluation.flags) && evaluation.flags.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {evaluation.flags.map((flag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No flags</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prompt {obfuscatePii && "(Obfuscated)"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-md">
            <pre className="whitespace-pre-wrap text-sm font-mono">{displayPrompt}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response {obfuscatePii && "(Obfuscated)"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-md">
            <pre className="whitespace-pre-wrap text-sm font-mono">{displayResponse}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
