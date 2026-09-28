import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const studentPassword = await bcrypt.hash('student123', 10)

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { studentId: 'admin' },
    update: {},
    create: {
      studentId: 'admin',
      name: 'System Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log({ admin })

  // 2. Create Courses
  const coursesData = [
    { name: 'Basic Computer Course (BCC / CCC)', description: 'Hardware fundamentals, Windows, Word, Excel shortcuts.' },
    { name: 'Diploma in Computer Application (DCA / ADCA)', description: 'DBMS concepts, advanced formulas, PowerPoint, file management.' },
    { name: 'Accounting & Taxation', description: 'Tally Prime shortcuts, Journal Entries, Ledger posting, GST slabs.' },
    { name: 'Web Development', description: 'HTML5 semantic tags, CSS Flexbox/Grid, JavaScript ES6 basics.' },
    { name: 'Programming in C / C++', description: 'Data types, loops, pointers, functions, OOP concepts.' },
  ]

  const createdCourses = []
  for (const course of coursesData) {
    const created = await prisma.course.create({ data: course })
    createdCourses.push(created)
  }

  // 3. Create Students and enroll them in all courses for testing
  const students = []
  for (let i = 1; i <= 3; i++) {
    const student = await prisma.user.create({
      data: {
        studentId: `UIIT-2024-00${i}`,
        name: `Student ${i}`,
        password: studentPassword,
        role: 'STUDENT',
        courses: {
          connect: createdCourses.map(c => ({ id: c.id }))
        }
      }
    })
    students.push(student)
  }

  // 4. Create an Exam for Web Development
  const webDevCourse = createdCourses.find(c => c.name === 'Web Development')
  if (webDevCourse) {
    const exam = await prisma.exam.create({
      data: {
        title: 'Web Development Mid-Term',
        courseId: webDevCourse.id,
        durationMins: 30,
        passingMarks: 50,
        questions: {
          create: [
            {
              text: 'What does HTML stand for?',
              options: {
                create: [
                  { text: 'Hyper Text Markup Language', isCorrect: true },
                  { text: 'Home Tool Markup Language', isCorrect: false },
                  { text: 'Hyperlinks and Text Markup Language', isCorrect: false }
                ]
              }
            },
            {
              text: 'Which property is used to change the background color?',
              options: {
                create: [
                  { text: 'color', isCorrect: false },
                  { text: 'bgcolor', isCorrect: false },
                  { text: 'background-color', isCorrect: true }
                ]
              }
            },
            {
              text: 'Inside which HTML element do we put the JavaScript?',
              options: {
                create: [
                  { text: '<scripting>', isCorrect: false },
                  { text: '<script>', isCorrect: true },
                  { text: '<js>', isCorrect: false }
                ]
              }
            }
          ]
        }
      }
    })
    console.log({ exam })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
