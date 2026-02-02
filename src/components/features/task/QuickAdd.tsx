'use client'

import { useState, useCallback } from 'react'
import { createInboxTask } from '@/actions/inbox'
import { AudioCapture } from '@/components/features/inbox/AudioCapture'
import { Plus, Loader2, CornerDownLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function QuickAdd() {
    const [title, setTitle] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!title.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await createInboxTask(title)
            setTitle('')
            setIsExpanded(false)
        } catch (error) {
            console.error('Error creating task:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleTranscript = useCallback((text: string) => {
        // If text is not empty, append it. 
        // We might want to handle this smarter (e.g., if it's a new sentence).
        setTitle(prev => {
            const separator = prev.length > 0 && !prev.endsWith(' ') ? ' ' : ''
            return prev + separator + text
        })
    }, [])

    if (!isExpanded) {
        return (
            <div
                onClick={() => setIsExpanded(true)}
                className="group cursor-pointer flex items-center gap-2 text-neutral-500 hover:text-[#dc4c3e] transition-colors py-2 px-1 rounded hover:bg-[#dc4c3e]/5"
            >
                <div className="w-[18px] h-[18px] rounded-full border border-transparent group-hover:bg-[#dc4c3e] text-white flex items-center justify-center transition-all bg-transparent">
                    <Plus className="w-4 h-4 text-[#dc4c3e] group-hover:text-white" />
                </div>
                <span className="text-[14px]">Añadir tarea</span>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 rounded-[10px] p-3 shadow-sm animate-in fade-in zoom-in-95 duration-200 bg-background">
            <div className="flex gap-2">
                <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nombre de la tarea"
                    className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium placeholder:text-neutral-500 text-foreground"
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setIsExpanded(false)
                            setTitle('')
                        }
                    }}
                />
            </div>

            <div className="flex justify-between items-center mt-3 pt-2">
                <div className="flex gap-2">
                    <div className="scale-90 origin-left border border-neutral-200 dark:border-neutral-700 rounded px-1.5 py-0.5 flex items-center gap-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                        <Calendar size={13} />
                        <span className="text-[12px]">Hoy</span>
                    </div>

                    <div className="scale-90 origin-left border border-neutral-200 dark:border-neutral-700 rounded px-1.5 py-0.5 flex items-center gap-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full border border-neutral-500"></div>
                        <span className="text-[12px]">Prioridad</span>
                    </div>

                    <div className="scale-90 origin-left">
                        <AudioCapture onTranscript={handleTranscript} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="bg-neutral-100 dark:bg-[#2a2a2a] hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300 h-8"
                        onClick={() => {
                            setIsExpanded(false)
                            setTitle('')
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        disabled={!title.trim() || isSubmitting}
                        className={!title.trim() ? 'opacity-50' : 'bg-[#dc4c3e] hover:bg-[#c0392b] text-white h-8'}
                    >
                        {isSubmitting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <>
                                Añadir tarea
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
