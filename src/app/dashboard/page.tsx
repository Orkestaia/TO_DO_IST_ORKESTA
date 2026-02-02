import { prisma } from '@/lib/prisma'
import { BarChart3, CheckSquare, AlertCircle, Clock } from 'lucide-react'

export default async function DashboardPage() {
    // Metrics
    const totalCompleted = await prisma.task.count({ where: { status: 'done' } })
    const p1Active = await prisma.task.count({ where: { priority: 'P1', status: { not: 'done' } } })
    const waiting = await prisma.task.count({ where: { status: 'waiting' } })

    // Tasks by Project (Active)
    const tasksByProject = await prisma.task.groupBy({
        by: ['projectId'],
        where: { status: { not: 'done' }, projectId: { not: null } },
        _count: { id: true }
    })

    // Resolve project names
    const projectStats = await Promise.all(tasksByProject.map(async (item: any) => {
        if (!item.projectId) return null
        const project = await prisma.project.findUnique({ where: { id: item.projectId } })
        return { name: project?.name, count: item._count.id, color: project?.color }
    }))

    const validProjectStats = projectStats.filter(p => p !== null) as any[]

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
                    <BarChart3 /> Dashboard Ejecutivo
                </h1>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 text-neutral-400 mb-2">
                        <CheckSquare size={20} /> Total Completadas
                    </div>
                    <div className="text-4xl font-bold text-white">{totalCompleted}</div>
                </div>

                <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-xl">
                    <div className="flex items-center gap-3 text-red-400 mb-2">
                        <AlertCircle size={20} /> P1 Activas (Foco)
                    </div>
                    <div className="text-4xl font-bold text-red-200">{p1Active}</div>
                    <div className="text-xs text-red-400 mt-2">Max. recomendado: 5</div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 text-neutral-400 mb-2">
                        <Clock size={20} /> En Espera (Waiting)
                    </div>
                    <div className="text-4xl font-bold text-white">{waiting}</div>
                </div>
            </div>

            {/* Project Distribution */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Carga por Proyecto (Activas)</h2>
                <div className="space-y-4">
                    {validProjectStats.length === 0 ? (
                        <p className="text-neutral-500">No hay datos suficientes.</p>
                    ) : (
                        validProjectStats.map((stat, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>{stat.name}</span>
                                    <span className="text-neutral-400">{stat.count} tareas</span>
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-600 rounded-full"
                                        style={{ width: `${Math.min((stat.count / 10) * 100, 100)}%` }} // Simple scale
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}
