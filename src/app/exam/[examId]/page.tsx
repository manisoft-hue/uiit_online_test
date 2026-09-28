import { getExamForTaking } from "@/app/actions/student";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExamClient from "./ExamClient";

export default async function ExamPage({ params }: { params: { examId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
        redirect("/login");
    }

    const exam = await getExamForTaking(params.examId);

    if (!exam) {
        return <div className="p-8 text-center text-red-400">Exam not found or you do not have access.</div>;
    }

    return (
        <ExamClient exam={exam} userId={session.user.id} />
    )
}
