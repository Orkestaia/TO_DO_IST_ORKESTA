'use client'

import { useTransition } from 'react'
import { Calendar, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toggleTaskStatus } from '@/actions/tasks'

interface TaskProps {
    task: {
        id: string
        title: string
        priority: string
        status: string
        dueDate: Date | string | null
        project?: { name: string, color?: string | null } | null
        labels?: string | null
    }
}

export function TaskCard({ task }: TaskProps) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        startTransition(() => {
            toggleTaskStatus(task.id, task.status)
        })
    }

    const isDone = task.status === 'done'

    // Priority colors for Todoist style (Ring around checkbox usually, or just text color)
    const priorityClass = (p: string) => {
        switch (p) {
            case 'P1': return 'border-red-500 bg-red-500/10'
            case 'P2': return 'border-orange-500'
            case 'P3': return 'border-blue-500'
            default: return 'border-neutral-400 dark:border-neutral-500'
        }
    }

    return (
        <div className={cn(
            "group flex items-start gap-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800 transition-all hover:bg-neutral-50 dark:hover:bg-transparent -mx-2 px-2 rounded-md",
            isDone && "opacity-50"
        )}>
            {/* Checkbox */}
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={cn(
                    "task-checkbox mt-0.5 shrink-0",
                    priorityClass(task.priority),
                    isDone && "bg-neutral-400 border-neutral-400"
                )}
            >
                {isDone && <span className="text-white text-[10px]">✓</span>}
            </button>

            <div className="flex-1 min-w-0">
                <div className={cn("text-[14px] leading-snug mb-0.5 text-neutral-800 dark:text-neutral-200", isDone && "line-through text-neutral-500")}>
                    {task.title}
                </div>

                <div className="flex items-center gap-3 text-[12px] text-neutral-500">
                    {task.dueDate && (
                        <span className={cn("flex items-center gap-1", task.priority === 'P1' ? 'text-red-500' : '')}>
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        </span>
                    )}

                    {task.project && (
                        <span className="flex items-center gap-1 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.project.color || '#888' }} />
                            {task.project.name}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
