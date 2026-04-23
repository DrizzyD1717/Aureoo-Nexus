import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import KanbanBoard from "@/components/KanbanBoard"; // Import the new component

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!project) redirect("/dashboard");

  // Fetch the tasks securely on the server
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });

  return (
    <div className="min-h-screen bg-obsidian text-silver-light">
      <nav className="border-b border-obsidian-300 bg-obsidian-100/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-obsidian-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-silver" />
          </Link>
          <div className="h-4 w-px bg-obsidian-300" />
          <span className="font-medium">{project.title}</span>
          <span className="text-sm px-2 py-0.5 rounded-full bg-obsidian-200 border border-obsidian-300 ml-auto">
            {project.status}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 overflow-x-auto">
        {/* Pass the data to the Client Component */}
        <KanbanBoard initialTasks={tasks || []} />
      </main>
    </div>
  );
}
