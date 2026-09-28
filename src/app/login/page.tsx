"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        studentId,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Student ID or password");
      } else {
        router.push(searchParams.get("from") || "/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            placeholder="e.g. UIIT-2024-001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            className="bg-zinc-800 border-zinc-700 focus-visible:ring-indigo-500 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-zinc-800 border-zinc-700 focus-visible:ring-indigo-500 text-zinc-100"
          />
        </div>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </CardContent>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-full">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">UIIT Portal Login</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your Student ID and password to access your courses and exams
          </CardDescription>
        </CardHeader>
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
