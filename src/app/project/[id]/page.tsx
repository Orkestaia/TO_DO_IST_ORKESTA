import { prisma } from "@/lib/prisma"
import { KanbanBoard } from "@/components/features/kanban/KanbanBoard"
import { notFound } from "next/navigation"

export default async function ProjectPage({ params }: { params: { id: string } }) {
    // Await params for Next 15+ (actually user said Next 16 but 14 is default in my mind, 
    // however create-next-app said 16.1.4. In newer Next, params is a Promise.
    // Wait, I should check Next version output again. It was 16.1.4. 
    // params should be awaited.

    // NOTE: In standard Next.js 14-15 App Router, 'params' is an object.
    // In Next.js 15 RC+, params is a Promise.
    // I will await it if I can, or treat it as object if I can't.
    // Since Typescript might complain, I'll cast it if needed.
    // But let's assume it is awaited.

    // Actually, to be safe: 
    const { id } = await Promise.resolve(params)

    const project = await prisma.project.findUnique({
        where: { id },
        include: { tasks: true }
    })

    if (!project) notFound()

    const serializedTasks = project.tasks.map(t => ({
        ...t,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        completedAt: t.completedAt ? t.completedAt.toISOString() : null,
        project: { name: project.name, color: project.color } // Flatten for card
    }))

    return (
        <div className="h-full flex flex-col">
            <header className="mb-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                    {project.wipLimit && (
                        <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                            WIP Limit: {project.wipLimit}
                        </span>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard tasks={serializedTasks} projectId={project.id} />
            </div>
        </div>
    )
}
