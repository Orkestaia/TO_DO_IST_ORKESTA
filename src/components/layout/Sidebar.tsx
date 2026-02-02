'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Inbox,
    Calendar,
    LayoutDashboard,
    Hash,
    ChevronRight,
    ChevronDown,
    Plus,
    Search,
    Bell,
    PanelLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ProjectHelpers = {
    id: string;
    name: string;
    children: { id: string; name: string }[]
}

export function Sidebar({ projects }: { projects: ProjectHelpers[] }) {
    const pathname = usePathname()
    const [expanded, setExpanded] = useState<string[]>(projects.map(p => p.id))

    const toggleExpand = (id: string) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    return (
        <aside className="w-[280px] h-screen bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0 pt-3 overflow-y-auto select-none transition-colors z-50">

            {/* Top Header: User Profile & Icons */}
            <div className="px-3 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] p-1 rounded cursor-pointer transition-colors max-w-[180px]">
                    <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        A
                    </div>
                    <span className="text-[14px] font-medium truncate">Aitor</span>
                    <ChevronDown size={14} className="text-neutral-500" />
                </div>
                <div className="flex items-center gap-1 text-neutral-400">
                    <button className="p-1 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] rounded transition-colors">
                        <Bell size={18} />
                    </button>
                    <button className="p-1 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] rounded transition-colors">
                        <PanelLeft size={18} />
                    </button>
                </div>
            </div>

            {/* Quick Add Button */}
            <div className="px-2 mb-2">
                <button className="flex items-center gap-2 w-full text-[#dc4c3e] hover:bg-[#dc4c3e]/10 px-2 py-1.5 rounded transition-colors group">
                    <div className="w-6 h-6 rounded-full bg-[#dc4c3e] flex items-center justify-center text-white shadow-sm group-hover:bg-[#c0392b] transition-colors">
                        <Plus size={16} />
                    </div>
                    <span className="font-semibold text-[14px]">Añadir tarea</span>
                </button>
            </div>

            {/* Main Nav */}
            <div className="px-2 pb-2 space-y-0.5">
                <NavItem href="#" icon={Search} label="Buscador" />
                <NavItem href="/inbox" icon={Inbox} label="Bandeja de entrada" active={pathname === '/inbox'} count={3} />
                <NavItem href="/" icon={LayoutDashboard} label="Hoy" active={pathname === '/'} count={10} />
                <NavItem href="/upcoming" icon={Calendar} label="Próximo" active={pathname === '/upcoming'} />
            </div>

            {/* Projects Header */}
            <div className="px-4 py-3 mt-2 flex items-center justify-between group">
                <span className="text-[13px] font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer">Mis Proyectos</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] p-0.5 rounded transition-colors">
                        <Plus size={16} />
                    </button>
                    <button className="text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] p-0.5 rounded transition-colors">
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* Projects List */}
            <div className="px-2 pb-10">
                {projects.map(project => (
                    <div key={project.id} className="mb-0.5">
                        <div className="group flex items-center gap-1 px-1 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-[#2a2a2a] cursor-pointer text-neutral-700 dark:text-neutral-300 transition-colors">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleExpand(project.id); }}
                                className="text-neutral-400 hover:text-neutral-600 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                {expanded.includes(project.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <span className="text-[13px] truncate flex-1 leading-none">{project.name.replace(/^\d+_/, '')}</span>
                            <span className="text-[11px] text-neutral-400 opacity-60 ml-2">4</span>
                        </div>

                        {expanded.includes(project.id) && (
                            <div className="ml-1 pl-2 border-l border-neutral-200 dark:border-neutral-800/50 mt-0.5">
                                {project.children.map(child => (
                                    <Link
                                        key={child.id}
                                        href={`/project/${child.id}`}
                                        className={cn(
                                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] mb-0.5 transition-colors group relative",
                                            pathname === `/project/${child.id}`
                                                ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 font-medium"
                                                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#2a2a2a]"
                                        )}
                                    >
                                        <span className={cn(
                                            "w-2 h-2 rounded-full shrink-0",
                                            pathname === `/project/${child.id}` ? "bg-red-500" : "bg-neutral-400/50"
                                        )} />
                                        <span className="truncate">{child.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    )
}

function NavItem({ href, icon: Icon, label, active, count }: any) {
    return (
        <Link
            href={href}
            className={cn(
                "sidebar-item",
                active && "active"
            )}
        >
            <Icon size={18} className={cn(active ? "text-red-500" : "text-neutral-500 opacity-80", "shrink-0")} />
            <span className="flex-1 truncate">{label}</span>
            {count && <span className="text-[11px] text-neutral-500 dark:text-neutral-500 font-normal">{count}</span>}
        </Link>
    )
}
