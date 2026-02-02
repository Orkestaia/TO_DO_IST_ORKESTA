'use client'

import { useState } from 'react'
import { createInboxTask } from '@/actions/inbox'
import { TaskCard } from '@/components/features/task/TaskCard'
import { Button } from '@/components/ui/Button'
import { AudioCapture } from './AudioCapture'
import { ProcessingWizard } from './ProcessingWizard'
import { Inbox, Plus } from 'lucide-react'

// Pass projects as props
export function InboxClient({ tasks, projects }: { tasks: any[], projects: any[] }) {
    const [wizardTask, setWizardTask] = useState<any | null>(null)
    const [quickTitle, setQuickTitle] = useState('')

    const handleQuickSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!quickTitle.trim()) return
        await createInboxTask(quickTitle)
        setQuickTitle('')
    }

    const handleAudioTranscript = async (text: string) => {
        // Auto-create task from audio
        // Maybe set transcript field? For now, title.
        await createInboxTask(text)
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 p-2">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
                    <Inbox size={32} /> Inbox
                </h1>
                <p className="text-neutral-400 text-sm">Captura todo lo que tengas en mente.</p>
            </header>

            {/* Quick Capture */}
            <div className="mb-8 flex gap-2">
                <form onSubmit={handleQuickSubmit} className="flex-1 flex gap-2">
                    <input
                        value={quickTitle}
                        onChange={e => setQuickTitle(e.target.value)}
                        placeholder="Captura rápida..."
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <Button type="submit">Guardar</Button>
                </form>
                <AudioCapture onTranscript={handleAudioTranscript} />
            </div>

            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500">
                        <p>Tu inbox está vacío. ¡Buen trabajo!</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <TaskCard task={task} />
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setWizardTask(task)}
                                className="h-[50px] px-4"
                            >
                                Procesar
                            </Button>
                        </div>
                    ))
                )}
            </div>

            {wizardTask && (
                <ProcessingWizard
                    task={wizardTask}
                    projects={projects}
                    onClose={() => setWizardTask(null)}
                />
            )}
        </div>
    )
}
