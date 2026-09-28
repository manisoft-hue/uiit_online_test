import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentDashboardData } from "@/app/actions/student";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const data = await getStudentDashboardData(session.user.id);
  if (!data) return <div>Data not found</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {data.name}</h1>
        <p className="text-zinc-400 mt-2">Here are your enrolled courses and upcoming exams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Enrolled Courses
            </h2>
            <div className="grid gap-4">
                {data.courses.map(course => (
                    <Card key={course.id} className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle>{course.name}</CardTitle>
                            <CardDescription className="text-zinc-400">{course.description}</CardDescription>
                        </CardHeader>
                        {course.exams.length > 0 && (
                            <CardContent>
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-zinc-300 mb-2">Available Exams</h4>
                                    {course.exams.map(exam => {
                                        const result = data.results.find(r => r.examId === exam.id);
                                        return (
                                            <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                                <div>
                                                    <p className="font-medium">{exam.title}</p>
                                                    <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                                                        <Clock className="w-3 h-3" /> {exam.durationMins} mins
                                                    </p>
                                                </div>
                                                {result ? (
                                                     <Link href={`/dashboard/results/${result.id}`}>
                                                        <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-700 text-zinc-300">
                                                            View Result
                                                        </Button>
                                                     </Link>
                                                ) : (
                                                    <Link href={`/exam/${exam.id}`}>
                                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                            Take Exam
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
                {data.courses.length === 0 && <p className="text-zinc-500">Not enrolled in any courses.</p>}
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Recent Results
            </h2>
            <div className="grid gap-4">
                 {data.results.length > 0 ? data.results.map(result => (
                    <Card key={result.id} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium">{result.exam.title}</p>
                                <p className="text-sm text-zinc-400 mt-1">Score: {result.score} / {result.totalMarks} ({result.percentage.toFixed(0)}%)</p>
                            </div>
                             <div className={`px-3 py-1 rounded-full text-xs font-medium ${result.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {result.passed ? 'Passed' : 'Failed'}
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                    <p className="text-zinc-500">No exams taken yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
