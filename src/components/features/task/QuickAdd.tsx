'use client'

import { useState, useCallback } from 'react'
import { createInboxTask } from '@/actions/inbox'
import { AudioCapture } from '@/components/features/inbox/AudioCapture'
import { Plus, Loader2, CornerDownLeft } from 'lucide-react'
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
                className="group cursor-pointer flex items-center gap-2 text-neutral-500 hover:text-red-500 transition-colors px-2 py-2 -ml-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
                <div className="w-[18px] h-[18px] rounded-full border border-transparent group-hover:bg-red-500 text-white flex items-center justify-center transition-all bg-transparent">
                    <Plus className="w-4 h-4 text-red-500 group-hover:text-white" />
                </div>
                <span className="text-[14px]">Añadir tarea</span>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-white dark:bg-neutral-900 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex gap-2">
                <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Escribe una tarea (ej. 'Revisar informe de ventas mañana a las 10am')"
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-neutral-400 text-neutral-900 dark:text-neutral-100"
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setIsExpanded(false)
                            setTitle('')
                        }
                    }}
                />
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex gap-1">
                    {/* Audio Capture integration */}
                    <div className="scale-90 origin-left">
                        <AudioCapture onTranscript={handleTranscript} />
                    </div>
                    {/* Future: Date picker, Priority, Project selector */}
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
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
                        className={!title.trim() ? 'opacity-50' : ''}
                    >
                        {isSubmitting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <>
                                Añadir tarea
                                <CornerDownLeft size={14} className="ml-2 opacity-50" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
