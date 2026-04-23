"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { LayoutTemplate } from "lucide-react";

// Define the shape of our Task data
type Task = {
  id: string;
  title: string;
  status: string;
  position: number;
};

const COLUMNS = ["Backlog", "In Progress", "Client Review", "Completed"];

export default function KanbanBoard({
  initialTasks,
}: {
  initialTasks: Task[];
}) {
  // Store the tasks in local React state so we can move them instantly
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const supabase = createClient();

  // 1. Pick up the card
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  // 2. Drop the card
  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    // Optimistic UI Update: Instantly move the card on the screen
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    // Background Database Update: Tell Supabase about the new column
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Failed to update task", error);
      // Optional: You could revert the state here if the database fails
    }
  };

  return (
    <div className="flex gap-6 min-w-max pb-8">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column);

        return (
          <div
            key={column}
            className="w-80 flex-shrink-0 flex flex-col max-h-[calc(100vh-12rem)]"
            // Allow this column to be a "drop zone"
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
                      {/* pointer-events-none ensures we drag the card, not the text inside it */}
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
  );
}
