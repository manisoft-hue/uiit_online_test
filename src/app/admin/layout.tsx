import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Users, BookOpen, FileText } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col">
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-bold text-lg">UIIT Admin</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
            <FileText className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/students" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
            <Users className="w-5 h-5" />
            Students
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
            <BookOpen className="w-5 h-5" />
            Courses
          </Link>
          <Link href="/admin/exams" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white">
            <FileText className="w-5 h-5" />
            Exams
          </Link>
        </nav>
        <div className="mt-auto pt-4 border-t border-zinc-800">
            <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
