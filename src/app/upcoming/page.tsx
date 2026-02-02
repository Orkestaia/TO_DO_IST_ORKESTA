import { TaskCard } from "@/components/features/task/TaskCard"
import { prisma } from "@/lib/prisma"
import { Calendar } from "lucide-react"

export default async function UpcomingPage() {
    const now = new Date()
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    // Fetch tasks due from tomorrow onwards
    const tasks = await prisma.task.findMany({
        where: {
            dueDate: { gte: startOfTomorrow },
            status: { not: 'done' }
        },
        orderBy: { dueDate: 'asc' },
        include: { project: true }
    })

    const serializedTasks = tasks.map(t => ({
        ...t,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        completedAt: t.completedAt ? t.completedAt.toISOString() : null,
    }))

    // Group by Date
    const grouped: Record<string, typeof serializedTasks> = {}
    serializedTasks.forEach(task => {
        const dateKey = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'
        if (!grouped[dateKey]) grouped[dateKey] = []
        grouped[dateKey].push(task)
    })

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
                    <Calendar /> Upcoming
                </h1>
                <p className="text-neutral-400 text-sm">Próximos 7 días</p>
            </header>

            <div className="space-y-8">
                {Object.keys(grouped).length === 0 ? (
                    <div className="text-center py-10 text-neutral-500">
                        <p>No tienes tareas programadas.</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([date, groupTasks]) => (
                        <section key={date}>
                            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2 bg-neutral-900/50 p-2 rounded">{date}</h2>
                            <div className="grid gap-2">
                                {groupTasks.map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </div>
        </div>
    )
}
