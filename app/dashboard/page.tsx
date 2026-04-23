import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, FolderKanban, DownloadCloud, FileText } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch Projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Fetch Assets from the user's specific storage folder
  const { data: assets } = await supabase.storage
    .from("client_assets")
    .list(user.id); // This looks inside the folder named after their User ID

  // Helper function to generate a secure download URL
  const getDownloadUrl = async (fileName: string) => {
    const { data } = await supabase.storage
      .from("client_assets")
      .createSignedUrl(`${user.id}/${fileName}`, 60 * 60); // Link valid for 1 hour
    return data?.signedUrl;
  };

  return (
    <div className="min-h-screen bg-obsidian text-silver-light">
      <nav className="border-b border-obsidian-300 bg-obsidian-100/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-light tracking-tight">
              Aureoo <span className="font-semibold text-silver">Nexus</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-silver-dark">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="p-2 hover:bg-obsidian-200 rounded-full transition-colors text-silver-dark hover:text-silver">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-light mb-2">Welcome back.</h1>
          <p className="text-silver-dark">
            Here is the current status of your active projects.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Projects Card (Unchanged) */}
          <div className="relative p-[1px] rounded-2xl bg-silver-gradient">
            <div className="bg-obsidian-100 rounded-2xl p-6 h-full border border-obsidian-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-obsidian-200 rounded-lg">
                  <FolderKanban className="w-5 h-5 text-silver" />
                </div>
                <h2 className="text-lg font-medium">Active Projects</h2>
              </div>
              <div className="space-y-4">
                {!projects || projects.length === 0 ? (
                  <p className="text-sm text-silver-dark">
                    No active projects found.
                  </p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-xl bg-obsidian-200 border border-obsidian-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-silver-light">
                          {project.title}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-obsidian text-silver-dark border border-obsidian-300">
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-silver-dark mb-4">
                        {project.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-silver-dark">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-obsidian h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-silver h-full rounded-full transition-all duration-1000"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Asset Vault Card */}
          <div className="relative p-[1px] rounded-2xl bg-silver-gradient">
            <div className="bg-obsidian-100 rounded-2xl p-6 h-full border border-obsidian-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-obsidian-200 rounded-lg">
                  <DownloadCloud className="w-5 h-5 text-silver" />
                </div>
                <h2 className="text-lg font-medium">Asset Vault</h2>
              </div>
              <div className="space-y-4">
                {!assets ||
                assets.length === 0 ||
                (assets.length === 1 &&
                  assets[0].name === ".emptyFolderPlaceholder") ? (
                  <p className="text-sm text-silver-dark">
                    No finalized assets are available for download yet.
                  </p>
                ) : (
                  assets.map(async (file) => {
                    // Supabase creates a hidden placeholder for empty folders, we skip it
                    if (file.name === ".emptyFolderPlaceholder") return null;

                    const url = await getDownloadUrl(file.name);

                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-obsidian-200 border border-obsidian-300 hover:border-silver/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="w-4 h-4 text-silver-dark flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-silver text-obsidian px-3 py-1.5 rounded-lg font-medium hover:bg-silver-light transition-colors flex-shrink-0 ml-2"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
