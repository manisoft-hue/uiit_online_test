"use server";

import { prisma } from "@/lib/prisma";

export async function getStudentDashboardData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      courses: {
        include: {
          exams: true,
        },
      },
      results: {
        include: {
          exam: true,
        }
      }
    },
  });

  return user;
}

export async function getExamForTaking(examId: string) {
  return await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: {
        include: {
          options: {
            select: { id: true, text: true, questionId: true } // Omit isCorrect for student
          }
        }
      },
      course: true,
    }
  });
}

export async function submitExam(examId: string, userId: string, answers: Record<string, string>, tabSwitchCount: number) {
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            questions: {
                include: { options: true }
            }
        }
    });

    if (!exam) throw new Error("Exam not found");

    let score = 0;
    const totalMarks = exam.questions.length; // Assuming 1 mark per question for simplicity

    for (const question of exam.questions) {
        const selectedOptionId = answers[question.id];
        if (selectedOptionId) {
            const selectedOption = question.options.find(o => o.id === selectedOptionId);
            if (selectedOption?.isCorrect) {
                score++;
            } else if (exam.negativeMarking) {
                // Example negative marking logic if enabled
                 score -= 0.25;
            }
        }
    }

    const percentage = (score / totalMarks) * 100;
    const passed = percentage >= exam.passingMarks;

    const result = await prisma.result.create({
        data: {
            userId,
            examId,
            score,
            totalMarks,
            percentage,
            passed,
            tabSwitchCount,
        }
    });

    return result;
}

export async function getExamResult(resultId: string) {
    return await prisma.result.findUnique({
        where: { id: resultId },
        include: {
            exam: {
                include: {
                    questions: {
                        include: {
                            options: true
                        }
                    }
                }
            }
        }
    })
}
