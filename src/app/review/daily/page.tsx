'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DailyReviewPage() {
    const [step, setStep] = useState(1)
    const router = useRouter()

    const steps = [
        {
            title: "1. Vaciar Inbox",
            description: "Revisa y procesa todo lo que capturaste hoy.",
            actionLabel: "Ir al Inbox",
            actionLink: "/inbox"
        },
        {
            title: "2. Revisar 'Waiting'",
            description: "Revisa tareas bloqueadas o esperando respuesta.",
            actionLabel: "Ver Waiting (Filtro pendiente)", // Placeholder
            actionLink: "/project/waiting"
        },
        {
            title: "3. Planificar Mañana",
            description: "Selecciona 1-3 objetivos clave para mañana.",
            actionLabel: "Ir a Upcoming",
            actionLink: "/upcoming"
        }
    ]

    const currentStep = steps[step - 1]

    return (
        <div className="max-w-2xl mx-auto pt-20 text-center">
            <div className="mb-8">
                <span className="text-sm font-mono text-purple-400">PASO {step} DE 3</span>
                <h1 className="text-3xl font-bold mt-2">{currentStep.title}</h1>
                <p className="text-neutral-400 mt-2 text-lg">{currentStep.description}</p>
            </div>

            <div className="bg-neutral-900/50 p-8 rounded-xl border border-neutral-800 mb-8 min-h-[200px] flex flex-col items-center justify-center">
                {/* Simulation of embedded content or link */}
                <Link
                    href={currentStep.actionLink}
                    target="_blank"
                    className="mb-4 inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-12 px-6 text-lg"
                >
                    {currentStep.actionLabel}
                </Link>
                <p className="text-xs text-neutral-500">Abre en nueva pestaña para no perder el flujo.</p>
            </div>

            <div className="flex justify-center gap-4">
                {step > 1 && (
                    <Button variant="ghost" onClick={() => setStep(step - 1)}>Anterior</Button>
                )}
                {step < 3 ? (
                    <Button onClick={() => setStep(step + 1)}>Siguiente Paso</Button>
                ) : (
                    <Button onClick={() => router.push('/')}>Terminar Revisión</Button>
                )}
            </div>
        </div>
    )
}
