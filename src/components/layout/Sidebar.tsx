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
    Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ProjectHelpers = {
    id: string;
    name: string;
    children: { id: string; name: string }[]
}

export function Sidebar({ projects }: { projects: ProjectHelpers[] }) {
    const pathname = usePathname()
    const [expanded, setExpanded] = useState<string[]>(projects.map(p => p.id)) // Expand all by default

    const toggleExpand = (id: string) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    return (
        <aside className="w-[280px] h-screen bg-[#fafafa] dark:bg-[#1e1e1e] flex flex-col fixed left-0 top-0 border-r border-neutral-200 dark:border-neutral-800 pt-[50px] overflow-y-auto select-none transition-colors">

            {/* Main Nav */}
            <div className="px-3 pb-4">
                <NavItem href="/inbox" icon={Inbox} label="Inbox" active={pathname === '/inbox'} count={3} />
                <NavItem href="/" icon={LayoutDashboard} label="Today" active={pathname === '/'} count={5} />
                <NavItem href="/upcoming" icon={Calendar} label="Upcoming" active={pathname === '/upcoming'} />
            </div>

            {/* Projects Header */}
            <div className="px-5 py-2 flex items-center justify-between group">
                <span className="text-[13px] font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">Proyectos</span>
                <button className="text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all">
                    <Plus size={16} />
                </button>
            </div>

            {/* Projects List */}
            <div className="px-2 pb-10">
                {projects.map(project => (
                    <div key={project.id} className="mb-0.5">
                        <div
                            className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                            <button onClick={(e) => { e.stopPropagation(); toggleExpand(project.id); }} className="text-neutral-400 hover:text-neutral-600 p-0.5">
                                {expanded.includes(project.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <span className="text-[13px] truncate flex-1 font-medium">{project.name.replace(/^\d+_/, '')}</span>
                        </div>

                        {expanded.includes(project.id) && (
                            <div className="ml-2 pl-3 border-l border-neutral-200 dark:border-neutral-700 mt-1">
                                {project.children.map(child => (
                                    <Link
                                        key={child.id}
                                        href={`/project/${child.id}`}
                                        className={cn(
                                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] mb-0.5 transition-colors",
                                            pathname === `/project/${child.id}`
                                                ? "bg-red-50 text-red-700 dark:bg-red-900/10 dark:text-red-400"
                                                : "text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <Hash size={13} className={cn(
                                            "shrink-0",
                                            pathname === `/project/${child.id}` ? "text-red-500" : "text-neutral-400"
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
                "sidebar-item mb-0.5",
                active && "active"
            )}
        >
            <Icon size={18} className={cn(active ? "text-red-600 dark:text-red-400" : "text-neutral-500")} />
            <span className="flex-1">{label}</span>
            {count && <span className="text-[11px] text-neutral-400">{count}</span>}
        </Link>
    )
}
