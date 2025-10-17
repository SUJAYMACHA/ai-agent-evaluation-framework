"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, CheckCircle, Clock } from "lucide-react";

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

interface DashboardContentProps {
  evaluations: Evaluation[];
}

export default function DashboardContent({ evaluations }: DashboardContentProps) {
  // Calculate KPIs
  const totalEvals = evaluations.length;
  const avgLatency = evaluations.length > 0
    ? evaluations.reduce((sum, e) => sum + e.latency_ms, 0) / evaluations.length
    : 0;
  
  const successfulEvals = evaluations.filter(
    (e) => !e.flags || (Array.isArray(e.flags) && !e.flags.includes("failed"))
  );
  const successRate = totalEvals > 0 ? (successfulEvals.length / totalEvals) * 100 : 0;
  
  const avgScore = evaluations.length > 0
    ? evaluations.reduce((sum, e) => sum + Number(e.score), 0) / evaluations.length
    : 0;

  // Prepare chart data (last 7 days and last 30 days)
  const prepareChartData = (days: number) => {
    const now = new Date();
    const data: { date: string; avgLatency: number; successRate: number; count: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const dayEvals = evaluations.filter((e) => {
        const evalDate = new Date(e.created_at).toISOString().split("T")[0];
        return evalDate === dateStr;
      });
      
      const daySuccessful = dayEvals.filter(
        (e) => !e.flags || (Array.isArray(e.flags) && !e.flags.includes("failed"))
      );
      
      data.push({
        date: dateStr,
        avgLatency: dayEvals.length > 0
          ? dayEvals.reduce((sum, e) => sum + e.latency_ms, 0) / dayEvals.length
          : 0,
        successRate: dayEvals.length > 0 ? (daySuccessful.length / dayEvals.length) * 100 : 0,
        count: dayEvals.length,
      });
    }
    
    return data;
  };

  const chartData7Days = prepareChartData(7);
  const chartData30Days = prepareChartData(30);

  const kpis = [
    {
      title: "Total Evaluations",
      value: totalEvals.toLocaleString(),
      description: "Last 30 days",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Average Latency",
      value: `${Math.round(avgLatency)}ms`,
      description: "Response time",
      icon: Clock,
      color: "text-purple-600",
    },
    {
      title: "Success Rate",
      value: `${successRate.toFixed(1)}%`,
      description: "Non-failed evaluations",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Average Score",
      value: avgScore.toFixed(2),
      description: "Quality metric",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your AI agent evaluation metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latency Trend (7 Days)</CardTitle>
            <CardDescription>Average response time per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${Math.round(value)}ms`, 'Avg Latency']}
                />
                <Line type="monotone" dataKey="avgLatency" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate (7 Days)</CardTitle>
            <CardDescription>Daily success rate percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Success Rate']}
                />
                <Line type="monotone" dataKey="successRate" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latency Trend (30 Days)</CardTitle>
            <CardDescription>Average response time per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${Math.round(value)}ms`, 'Avg Latency']}
                />
                <Line type="monotone" dataKey="avgLatency" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate (30 Days)</CardTitle>
            <CardDescription>Daily success rate percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Success Rate']}
                />
                <Line type="monotone" dataKey="successRate" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
