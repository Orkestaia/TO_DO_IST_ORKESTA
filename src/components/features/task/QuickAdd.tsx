'use client'

import React, { useState, useEffect } from 'react'
import { createInboxTask } from '@/actions/inbox'
import { parseTaskInput } from '@/lib/smart-input'
import { AudioCapture } from '@/components/features/inbox/AudioCapture'
import {
    Plus,
    Calendar as CalendarIcon,
    Flag,
    Tag,
    AlarmClock,
    Inbox,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function QuickAdd() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('P4') // P1, P2, P3, P4
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset state when closed
    useEffect(() => {
        if (!isExpanded) {
            setTitle('')
            setDescription('')
            setPriority('P4')
            setDueDate(undefined)
        }
    }, [isExpanded])

    const handleSubmit = async () => {
        if (!title.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            // 1. Parse Smart Input first
            const { title: cleanTitle, priority: parsedPrio, dueDate: parsedDate } = parseTaskInput(title)

            // 2. Override with explicit UI selections
            const finalDate = dueDate || parsedDate
            const finalPriority = priority !== 'P4' ? priority : parsedPrio

            await createInboxTask(cleanTitle, finalPriority, finalDate || null)

            setIsExpanded(false)
        } catch (error) {
            console.error('Error creating task:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const priorityColors: Record<string, string> = {
        P1: 'text-red-500',
        P2: 'text-orange-500',
        P3: 'text-blue-500',
        P4: 'text-neutral-500'
    }

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 text-neutral-500 hover:text-[#dc4c3e] transition-colors py-2 px-1 rounded hover:bg-[#dc4c3e]/5 w-full text-left group"
            >
                <div className="w-[18px] h-[18px] rounded-full border border-transparent group-hover:bg-[#dc4c3e] text-white flex items-center justify-center transition-all">
                    <Plus className="w-4 h-4 text-[#dc4c3e] group-hover:text-white" />
                </div>
                <span className="text-[14px] font-normal">Añadir tarea</span>
            </button>
        )
    }

    return (
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg bg-background w-full animate-in fade-in zoom-in-95 duration-200 overflow-visible">

            {/* Input Area */}
            <div className="p-3 pb-2 space-y-2">
                <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nombre de la tarea"
                    className="w-full bg-transparent border-none outline-none text-[14px] font-medium placeholder:text-neutral-500 text-foreground"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit()
                        if (e.key === 'Escape') setIsExpanded(false)
                    }}
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción"
                    className="w-full bg-transparent border-none outline-none text-[12px] text-neutral-600 dark:text-neutral-400 placeholder:text-neutral-400"
                />
            </div>

            {/* Attributes Bar */}
            <div className="flex items-center gap-2 px-3 pb-2 flex-wrap">

                {/* Due Date Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 text-[12px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                            dueDate ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-900/10" : "text-neutral-500"
                        )}>
                            <CalendarIcon size={14} />
                            <span>
                                {dueDate ? format(dueDate, 'PP', { locale: es }) : 'Hoy'}
                            </span>
                            {dueDate && <X size={12} className="hover:text-red-700" onClick={(e) => { e.stopPropagation(); setDueDate(undefined); }} />}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Priority Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 text-[12px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                            priority !== 'P4' ? priorityColors[priority] : "text-neutral-500"
                        )}>
                            <Flag size={14} />
                            <span>{priority === 'P4' ? 'Prioridad' : priority}</span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[140px] p-0" align="start">
                        <Command>
                            <CommandList>
                                <CommandGroup>
                                    {[1, 2, 3, 4].map(p => (
                                        <CommandItem
                                            key={p}
                                            onSelect={() => setPriority(`P${p}`)}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <Flag size={14} className={priorityColors[`P${p}`]} />
                                            <span>Prioridad {p}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Labels Placeholder */}
                <button className="flex items-center gap-1.5 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 text-[12px] text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <Tag size={14} />
                    <span>Etiquetas</span>
                </button>

                <div className="flex-1" />
                <div className="scale-90">
                    <AudioCapture onTranscript={(t) => setTitle(prev => prev + ' ' + t)} />
                </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-2 px-3">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-neutral-500 text-[12px] hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <Inbox size={14} className="mr-2" />
                        Bandeja de entrada
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(false)}
                        className="h-8 px-3 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!title.trim() || isSubmitting}
                        className={cn(
                            "h-8 px-4 text-white font-medium transition-colors",
                            !title.trim() ? "bg-[#dc4c3e]/50 cursor-not-allowed" : "bg-[#dc4c3e] hover:bg-[#c0392b]"
                        )}
                    >
                        {isSubmitting ? 'Añadiendo...' : 'Añadir tarea'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
