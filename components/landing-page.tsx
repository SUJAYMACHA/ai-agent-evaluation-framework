"use client";

import Link from "next/link";
import { 
  BarChart3, 
  ArrowRight, 
  LineChart, 
  Activity, 
  Shield, 
  FileText, 
  CheckCircle,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Agent Eval</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/login?signup=true">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Monitor and Improve Your AI Agent Performance
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Track metrics, identify trends, and enhance your AI's effectiveness with our comprehensive evaluation framework.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Link href="/login?signup=true">
                  <Button size="lg" className="gap-1">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <BarChart3 className="h-12 w-12 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Comprehensive Analytics</h3>
                  <p className="text-muted-foreground">
                    Track key metrics and visualize performance data with interactive dashboards.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <LineChart className="h-12 w-12 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Performance Trends</h3>
                  <p className="text-muted-foreground">
                    Identify patterns and track improvements over time with detailed trend analysis.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <FileText className="h-12 w-12 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Detailed Reporting</h3>
                  <p className="text-muted-foreground">
                    Generate comprehensive reports to document your AI agent's performance.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Activity className="h-12 w-12 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Real-time Monitoring</h3>
                  <p className="text-muted-foreground">
                    Monitor AI agent performance in real-time with instant feedback.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Shield className="h-12 w-12 text-primary mb-2" />
                  <h3 className="text-xl font-bold">Data Security</h3>
                  <p className="text-muted-foreground">
                    Keep your evaluation data secure with robust authentication and authorization.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Database className="h-12 w-12 text-primary mb-2" />
                  <h3 className="text-xl font-bold">API Integration</h3>
                  <p className="text-muted-foreground">
                    Easily integrate with your existing systems using our developer-friendly API.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Streamlined Evaluation Process
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our framework simplifies the complex process of evaluating AI agents, 
                  allowing you to focus on improving performance rather than managing data.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Simple data ingestion from multiple sources</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Automated metric calculation and benchmarking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Customizable evaluation criteria</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Export-ready reports for stakeholders</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary-foreground/20 flex items-center justify-center text-white">
                  <BarChart3 className="h-20 w-20 opacity-50" />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to improve your AI performance?</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4 mb-8">
              Join forward-thinking teams who use our platform to monitor, evaluate, and enhance their AI agents.
            </p>
            <Link href="/login?signup=true">
              <Button size="lg" className="gap-1">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col gap-4 md:h-16 md:flex-row md:items-center px-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">AI Agent Eval</span>
          </div>
          <div className="md:ml-auto flex gap-4 sm:gap-6 items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} AI Agent Evaluation Framework. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}