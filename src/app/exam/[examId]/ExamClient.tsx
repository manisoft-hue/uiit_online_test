"use client";

import { useState, useEffect, useCallback } from "react";
import { submitExam } from "@/app/actions/student";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle, Flag } from "lucide-react";

type ExamClientProps = {
    exam: any;
    userId: string;
};

export default function ExamClient({ exam, userId }: ExamClientProps) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const [timeLeft, setTimeLeft] = useState(exam.durationMins * 60);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const questions = exam.questions;
    const currentQuestion = questions[currentQuestionIndex];

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const result = await submitExam(exam.id, userId, answers, tabSwitchCount);
            router.push(`/dashboard/results/${result.id}`);
        } catch (e) {
            console.error("Failed to submit", e);
            alert("Failed to submit exam. Please contact admin.");
            setIsSubmitting(false);
        }
    }, [exam.id, userId, answers, tabSwitchCount, isSubmitting, router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount((prev) => prev + 1);
                alert("Warning: Tab switching is tracked. Continuing this may invalidate your exam.");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [handleSubmit]);

    const handleOptionSelect = (optionId: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    };

    const toggleFlag = () => {
        setFlagged(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentQuestion.id)) {
                newSet.delete(currentQuestion.id);
            } else {
                newSet.add(currentQuestion.id);
            }
            return newSet;
        });
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
            {/* Header */}
            <header className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="font-bold text-lg">{exam.title}</h1>
                    <p className="text-sm text-zinc-400">{exam.course.name}</p>
                </div>
                <div className="flex items-center gap-6">
                    {tabSwitchCount > 0 && (
                        <div className="flex items-center gap-2 text-amber-500 text-sm font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            Warnings: {tabSwitchCount}
                        </div>
                    )}
                    <div className={`flex items-center gap-2 font-mono text-xl ${timeLeft < 300 ? 'text-red-400' : 'text-zinc-100'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {isSubmitting ? "Submitting..." : "Submit Exam"}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-zinc-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <Button variant="outline" size="sm" onClick={toggleFlag} className={`border-zinc-700 ${flagged.has(currentQuestion.id) ? 'bg-amber-500/10 text-amber-500 border-amber-500/50' : 'text-zinc-300 hover:bg-zinc-800'}`}>
                                <Flag className="w-4 h-4 mr-2" />
                                {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag for review'}
                            </Button>
                        </div>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-6">
                                <h2 className="text-xl mb-6">{currentQuestion.text}</h2>
                                <div className="space-y-3">
                                    {currentQuestion.options.map((option: any ) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionSelect(option.id)}
                                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                                                answers[currentQuestion.id] === option.id
                                                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-100'
                                                    : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                                            }`}
                                        >
                                            {option.text}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                disabled={currentQuestionIndex === questions.length - 1}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Palette */}
                <aside className="w-64 bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto">
                    <h3 className="font-medium text-sm text-zinc-400 mb-4 uppercase tracking-wider">Question Palette</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {questions.map((q: any , i: number) => {
                            const isAnswered = !!answers[q.id];
                            const isFlagged = flagged.has(q.id);
                            const isCurrent = i === currentQuestionIndex;

                            let bgColor = 'bg-zinc-800 text-zinc-400';
                            if (isCurrent) bgColor = 'bg-zinc-700 text-white ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-900';
                            else if (isFlagged) bgColor = 'bg-amber-500/20 text-amber-500 border border-amber-500/50';
                            else if (isAnswered) bgColor = 'bg-indigo-500 text-white';

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    className={`aspect-square flex items-center justify-center rounded text-sm font-medium transition-all ${bgColor}`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-zinc-400"><div className="w-3 h-3 rounded bg-zinc-800"></div> Unattempted</div>
                        <div className="flex items-center gap-2 text-indigo-400"><div className="w-3 h-3 rounded bg-indigo-500"></div> Attempted</div>
                        <div className="flex items-center gap-2 text-amber-400"><div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50"></div> Flagged</div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
