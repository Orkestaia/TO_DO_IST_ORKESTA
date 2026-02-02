import Link from 'next/link'
import { CheckCircle2, CalendarDays } from 'lucide-react'

export default function ReviewPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20 pt-10">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Revisiones Guiadas</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/review/daily" className="group block p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-800 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400 group-hover:text-blue-300">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Revisión Diaria</h2>
                            <p className="text-sm text-neutral-500">10 minutos</p>
                        </div>
                    </div>
                    <p className="text-neutral-400 text-sm">Vaciar Inbox, revisar tareas en espera y planificar objetivos de mañana.</p>
                </Link>

                <Link href="/review/weekly" className="group block p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-800 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400 group-hover:text-purple-300">
                            <CalendarDays size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">Revisión Semanal</h2>
                            <p className="text-sm text-neutral-500">45 minutos</p>
                        </div>
                    </div>
                    <p className="text-neutral-400 text-sm">Revisión profunda por cliente, ajustar prioridades P1 y limpieza.</p>
                </Link>
            </div>
        </div>
    )
}
