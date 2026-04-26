"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { LayoutTemplate, Plus, X, Loader2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
  status: string;
  position: number;
};

export default function KanbanBoard({
  initialTasks,
  projectId,
}: {
  initialTasks: Task[];
  projectId: string;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  // --- DRAG AND DROP LOGIC ---
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId);
  };

  // --- FORM SUBMISSION LOGIC ---
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsSubmitting(true);

    // 1. Insert into Supabase first so we get the real database ID back
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          project_id: projectId,
          title: newTaskTitle,
          status: "Backlog",
          position: tasks.length,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      // 2. Update the UI state with the real task
      setTasks([...tasks, data]);
      setNewTaskTitle("");
      setIsAdding(false);
    } else {
      console.error("Failed to add task", error);
    }

    setIsSubmitting(false);
  };

  const COLUMNS = ["Backlog", "In Progress", "Client Review", "Completed"];

  return (
    <>
      {/* Header with Add Button */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-silver-dark text-sm">
          Drag and drop tasks to update project progress.
        </p>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-silver text-obsidian px-4 py-2 rounded-lg font-medium hover:bg-silver-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Board Columns */}
      <div className="flex gap-6 min-w-max pb-8">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column);

          return (
            <div
              key={column}
              className="w-80 flex-shrink-0 flex flex-col max-h-[calc(100vh-12rem)]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, column)}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-medium text-silver-light">{column}</h3>
                <span className="text-xs font-medium text-silver-dark bg-obsidian-200 px-2 py-1 rounded-md">
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex-1 bg-obsidian-100/50 border border-obsidian-300 rounded-xl p-3 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="h-24 border-2 border-dashed border-obsidian-300 rounded-lg flex items-center justify-center text-silver-dark text-sm pointer-events-none">
                    Drop tasks here
                  </div>
                ) : (
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="bg-obsidian-200 p-4 rounded-lg border border-obsidian-300 shadow-sm cursor-grab active:cursor-grabbing hover:border-silver/50 transition-colors"
                      >
                        <div className="flex items-start gap-3 pointer-events-none">
                          <LayoutTemplate className="w-4 h-4 text-silver-dark flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-silver-light">
                            {task.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* The Add Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-obsidian-100 border border-obsidian-300 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-silver-light">
                New Task
              </h2>
              <button
                onClick={() => setIsAdding(false)}
                className="text-silver-dark hover:text-silver transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-silver-dark uppercase tracking-wider mb-2">
                  Task Description
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Design high-fidelity wireframes"
                  className="w-full bg-obsidian-200 border border-obsidian-300 text-silver-light rounded-xl py-3 px-4 focus:outline-none focus:border-silver focus:ring-1 focus:ring-silver transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-silver hover:bg-obsidian-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTaskTitle.trim()}
                  className="flex items-center gap-2 bg-silver text-obsidian px-4 py-2 rounded-lg text-sm font-medium hover:bg-silver-light transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
