import { getAdminDashboardData } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FileText, Activity } from "lucide-react";

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();

  const stats = [
    { title: "Total Students", value: data.studentsCount, icon: Users, color: "text-blue-400" },
    { title: "Active Courses", value: data.coursesCount, icon: BookOpen, color: "text-indigo-400" },
    { title: "Total Exams", value: data.examsCount, icon: FileText, color: "text-purple-400" },
    { title: "Total Results", value: data.resultsCount, icon: Activity, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-400 mt-2">Welcome to the UIIT Admin Dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Students</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-800/50 text-zinc-400">
                      <tr>
                          <th className="px-6 py-3 font-medium">Name</th>
                          <th className="px-6 py-3 font-medium">Student ID</th>
                          <th className="px-6 py-3 font-medium">Joined</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                      {data.recentStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-zinc-800/50">
                              <td className="px-6 py-4">{student.name}</td>
                              <td className="px-6 py-4 font-mono text-zinc-400">{student.studentId}</td>
                              <td className="px-6 py-4 text-zinc-400">{new Date(student.createdAt).toLocaleDateString()}</td>
                          </tr>
                      ))}
                      {data.recentStudents.length === 0 && (
                          <tr><td colSpan={3} className="px-6 py-4 text-center text-zinc-500">No students found</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
}
