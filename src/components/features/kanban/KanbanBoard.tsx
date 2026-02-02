'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core'
import { TaskCard } from '@/components/features/task/TaskCard'
import { moveTask } from '@/actions/kanban'
import { cn } from '@/lib/utils'

// Types
type Task = any // Using any for speed, should match serialized task
type ColumnId = 'backlog' | 'in_progress' | 'waiting' | 'recurring' | 'done'

const COLUMNS: { id: ColumnId, label: string }[] = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'in_progress', label: 'En Curso' },
    { id: 'waiting', label: 'Esperando' },
    { id: 'recurring', label: 'Recurrente' },
    { id: 'done', label: 'Hecho' }
]

export function KanbanBoard({ tasks: initialTasks, projectId }: { tasks: Task[], projectId: string }) {
    const [tasks, setTasks] = useState(initialTasks)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const taskId = active.id as string
        const newStatus = over.id as string
        const currentTask = tasks.find(t => t.id === taskId)

        if (currentTask && currentTask.status !== newStatus) {
            // Optimistic UI update
            const oldStatus = currentTask.status
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))

            const result = await moveTask(taskId, newStatus, projectId)
            if (!result.success) {
                // Revert
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: oldStatus } : t))
                setError(result.error || 'Error moving task')
                setTimeout(() => setError(null), 3000)
            }
        }
    }

    const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status)

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {error && (
                <div className="fixed top-4 right-4 bg-red-900 border border-red-700 text-white px-4 py-2 rounded shadow-lg z-50">
                    {error}
                </div>
            )}
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {COLUMNS.map(col => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.label}
                        tasks={getTasksByStatus(col.id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <div className="opacity-80 rotate-2">
                        <TaskCard task={tasks.find(t => t.id === activeId)} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

function KanbanColumn({ id, title, tasks }: { id: string, title: string, tasks: Task[] }) {
    const { setNodeRef, isOver } = useDroppable({ id })

    return (
        <div className="flex-shrink-0 w-80 bg-neutral-900/30 border border-neutral-800 rounded-lg flex flex-col h-full">
            <div className="p-3 border-b border-neutral-800 font-medium text-sm text-neutral-400 flex justify-between">
                {title}
                <span className="bg-neutral-800 text-neutral-500 rounded px-1.5 text-xs">{tasks.length}</span>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-2 space-y-2 overflow-y-auto min-h-[150px]",
                    isOver && "bg-neutral-800/20"
                )}
            >
                {tasks.map(task => (
                    <DraggableTask key={task.id} task={task} />
                ))}
            </div>
        </div>
    )
}

function DraggableTask({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    })

    // Simple transform style
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={cn(isDragging && "opacity-0")}>
            <TaskCard task={task} />
        </div>
    )
}
