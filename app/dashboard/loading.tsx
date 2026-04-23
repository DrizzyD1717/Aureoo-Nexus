import { FolderKanban, DownloadCloud, LogOut } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-obsidian text-silver-light">
      {/* Static Navbar (Instantly loads) */}
      <nav className="border-b border-obsidian-300 bg-obsidian-100/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-light tracking-tight">
              Aureoo <span className="font-semibold text-silver">Nexus</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-32 bg-obsidian-300 rounded-md animate-pulse" />
            <div className="p-2 text-silver-dark">
              <LogOut className="w-4 h-4 opacity-50" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-light mb-2">Welcome back.</h1>
          <p className="text-silver-dark">Loading your active projects...</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skeleton Project Card */}
          <div className="relative p-[1px] rounded-2xl bg-silver-gradient">
            <div className="bg-obsidian-100 rounded-2xl p-6 h-full border border-obsidian-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-obsidian-200 rounded-lg">
                  <FolderKanban className="w-5 h-5 text-silver opacity-50" />
                </div>
                <h2 className="text-lg font-medium">Active Projects</h2>
              </div>

              <div className="space-y-4">
                {/* 2 pulsing placeholder blocks */}
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-obsidian-200 border border-obsidian-300 animate-pulse"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-5 w-1/2 bg-obsidian-300 rounded" />
                      <div className="h-5 w-16 bg-obsidian-300 rounded-full" />
                    </div>
                    <div className="h-3 w-3/4 bg-obsidian-300 rounded mb-4 mt-3" />
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between">
                        <div className="h-3 w-12 bg-obsidian-300 rounded" />
                        <div className="h-3 w-8 bg-obsidian-300 rounded" />
                      </div>
                      <div className="w-full bg-obsidian h-1.5 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skeleton Asset Vault Card */}
          <div className="relative p-[1px] rounded-2xl bg-silver-gradient">
            <div className="bg-obsidian-100 rounded-2xl p-6 h-full border border-obsidian-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-obsidian-200 rounded-lg">
                  <DownloadCloud className="w-5 h-5 text-silver opacity-50" />
                </div>
                <h2 className="text-lg font-medium">Asset Vault</h2>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-obsidian-200 border border-obsidian-300 animate-pulse"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-4 h-4 bg-obsidian-300 rounded flex-shrink-0" />
                      <div className="h-4 w-2/3 bg-obsidian-300 rounded" />
                    </div>
                    <div className="h-6 w-20 bg-obsidian-300 rounded-lg ml-2 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
