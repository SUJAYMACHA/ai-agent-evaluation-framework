"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

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

interface EvaluationsTableProps {
  evaluations: Evaluation[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function EvaluationsTable({
  evaluations,
  currentPage,
  totalPages,
  totalCount,
}: EvaluationsTableProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/evaluations?page=${newPage}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
          <p className="text-muted-foreground">
            Total: {totalCount.toLocaleString()} evaluations
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evaluation Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interaction ID</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No evaluations found
                  </TableCell>
                </TableRow>
              ) : (
                evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-mono text-sm">
                      {evaluation.interaction_id.substring(0, 12)}...
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          evaluation.score >= 0.8
                            ? "bg-green-100 text-green-700"
                            : evaluation.score >= 0.5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {evaluation.score.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{evaluation.latency_ms}ms</TableCell>
                    <TableCell>
                      {evaluation.flags && Array.isArray(evaluation.flags) && evaluation.flags.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {evaluation.flags.map((flag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(evaluation.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/evaluations/${evaluation.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
