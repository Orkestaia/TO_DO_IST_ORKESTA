import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/features/task/TaskCard"
import { QuickAdd } from "@/components/features/task/QuickAdd"
import { getTodayTasks } from "@/actions/tasks"
import { LayoutDashboard, CheckCircle2 } from "lucide-react"

export default async function Home() {
  const tasks = await getTodayTasks()

  const serializedTasks = tasks.map(t => ({
    ...t,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    completedAt: t.completedAt ? t.completedAt.toISOString() : null,
  }))

  const now = new Date()
  const dateStr = now.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })
  const capitalDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  // Sort by Priority (P1 > P2 > P3 > P4) then by CreatedAt
  const sortedTasks = serializedTasks.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority.localeCompare(b.priority)
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="animate-in fade-in duration-500 max-w-[800px] mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-[26px] font-bold tracking-tight text-neutral-900 dark:text-white">Hoy</h1>
          <span className="text-[12px] text-neutral-500 mt-1.5">{sortedTasks.length} tareas</span>
        </div>

        <div className="flex items-center gap-2 text-neutral-500 text-[12px] border-b border-neutral-100 dark:border-neutral-800 pb-2">
          <CheckCircle2 size={14} className="text-neutral-400" />
          <span>{sortedTasks.filter(t => t.status === 'done').length} completadas</span>
        </div>
      </header>

      <div className="space-y-0.5">
        {sortedTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        {sortedTasks.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-neutral-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <LayoutDashboard size={40} className="text-neutral-300 dark:text-neutral-700" />
            </div>
            <p className="text-neutral-500 text-[14px]">Todo limpio. Disfruta tu día.</p>
          </div>
        )}
      </div>

      {/* Quick Add Bottom Trigger */}
      <div className="mt-4">
        <QuickAdd />
      </div>
    </div>
  )
}
