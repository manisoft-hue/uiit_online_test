"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getAdminDashboardData() {
  const studentsCount = await prisma.user.count({ where: { role: "STUDENT" } });
  const coursesCount = await prisma.course.count();
  const examsCount = await prisma.exam.count();
  const resultsCount = await prisma.result.count();

  const recentStudents = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return { studentsCount, coursesCount, examsCount, resultsCount, recentStudents };
}

export async function getCourses() {
    return await prisma.course.findMany();
}

export async function getExams() {
    return await prisma.exam.findMany({ include: { course: true, _count: { select: { questions: true } } } });
}

export async function createStudent(data: { studentId: string; name: string }) {
    const password = await bcrypt.hash("student123", 10);
    return await prisma.user.create({
        data: {
            ...data,
            password,
            role: "STUDENT",
        }
    })
}
