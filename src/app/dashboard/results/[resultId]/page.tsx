import { getExamResult } from "@/app/actions/student";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ResultPage({ params }: { params: { resultId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
        redirect("/login");
    }

    const result = await getExamResult(params.resultId);

    if (!result || result.userId !== session.user.id) {
        return <div className="p-8 text-center text-red-400">Result not found or access denied.</div>;
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-4 text-zinc-400 hover:text-white -ml-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Exam Result</h1>
                <p className="text-zinc-400 mt-2">{result.exam.title}</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-zinc-800 mb-4">
                        {result.passed ? (
                            <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                        ) : (
                            <XCircle className="w-16 h-16 text-red-400" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold">{result.passed ? 'Congratulations, you passed!' : 'Unfortunately, you did not pass.'}</h2>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800 mt-6">
                        <div>
                            <p className="text-sm text-zinc-400">Score</p>
                            <p className="text-2xl font-bold">{result.score} <span className="text-lg text-zinc-500">/ {result.totalMarks}</span></p>
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Percentage</p>
                            <p className="text-2xl font-bold">{result.percentage.toFixed(1)}%</p>
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Status</p>
                            <p className={`text-2xl font-bold ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>{result.passed ? 'PASS' : 'FAIL'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Detailed Solution Review</h3>
                <div className="space-y-4">
                    {result.exam.questions.map((q, index) => (
                        <Card key={q.id} className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium">
                                    <span className="text-zinc-500 mr-2">Q{index + 1}.</span> {q.text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {q.options.map(opt => (
                                    <div key={opt.id} className={`p-3 rounded-md border flex items-center justify-between ${
                                        opt.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100' : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400'
                                    }`}>
                                        <span>{opt.text}</span>
                                        {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                    </div>
                                ))}
                                {q.explanation && (
                                    <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-sm text-indigo-100">
                                        <span className="font-semibold block mb-1">Explanation:</span>
                                        {q.explanation}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
