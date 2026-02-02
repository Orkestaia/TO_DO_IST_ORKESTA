'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { processTask } from '@/actions/process'
import { X, ArrowRight, Check } from 'lucide-react'

type Project = { id: string, name: string, parentId: string | null }

export function ProcessingWizard({ task, projects, onClose }: { task: any, projects: Project[], onClose: () => void }) {
    const [step, setStep] = useState(1)
    const [data, setData] = useState({
        projectId: '',
        priority: 'P2', // Default
        dueDate: '',
        energyLabel: '',
        status: 'backlog'
    })

    const handleSave = async () => {
        // Determine status based on "Idea" vs "Task" logic if needed, 
        // but here assuming it is a Task if we are assigning props.
        await processTask(task.id, data)
        onClose()
    }

    // Step 1: Project & Type
    if (step === 1) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Procesar: {task.title}</h3>
                        <button onClick={onClose}><X size={20} className="text-neutral-500" /></button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-400">¿A qué proyecto pertenece?</label>
                            <select
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-sm"
                                value={data.projectId}
                                onChange={e => setData({ ...data, projectId: e.target.value })}
                            >
                                <option value="">Selecciona un proyecto...</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => {
                                    // Maybe "Idea" goes to a specific backlog or tagged?
                                    // For now just set P4 + Ideas project?
                                    // Let's keep it simple: Select project is enough.
                                    setData({ ...data, priority: 'P4' })
                                    setStep(2)
                                }}
                            >
                                Es una Idea (P4)
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => setStep(2)}
                                disabled={!data.projectId}
                            >
                                Es una Tarea <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Step 2: Details
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Detalles</h3>
                    <button onClick={onClose}><X size={20} className="text-neutral-500" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-neutral-500 uppercase font-bold">Prioridad</label>
                            <div className="flex gap-1">
                                {['P1', 'P2', 'P3', 'P4'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setData({ ...data, priority: p })}
                                        className={`px-3 py-1 rounded text-sm border ${data.priority === p ? 'bg-purple-600 border-purple-600 text-white' : 'border-neutral-800 text-neutral-400'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-neutral-500 uppercase font-bold">Energía</label>
                            <select
                                className="w-full bg-neutral-950 border border-neutral-800 rounded p-1.5 text-sm"
                                value={data.energyLabel}
                                onChange={e => setData({ ...data, energyLabel: e.target.value })}
                            >
                                <option value="">Ninguna</option>
                                <option value="@deep">Deep Work</option>
                                <option value="@operativo">Operativo</option>
                                <option value="@comunicacion">Comunicación</option>
                                <option value="@creativo">Creativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-neutral-500 uppercase font-bold">Fecha Vencimiento</label>
                        <input
                            type="date"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-sm text-white color-scheme-dark"
                            value={data.dueDate}
                            onChange={e => setData({ ...data, dueDate: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
                        <Button onClick={handleSave}>
                            <Check size={16} className="mr-2" />
                            Guardar y Archivar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
