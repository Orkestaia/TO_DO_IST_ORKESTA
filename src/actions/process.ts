'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function processTask(taskId: string, data: {
    projectId: string
    priority: string
    dueDate?: string | null
    energyLabel?: string
    contextLabel?: string
    status?: string // e.g. 'backlog' (default for processed) or 'in_progress'
}) {
    await prisma.task.update({
        where: { id: taskId },
        data: {
            projectId: data.projectId,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            energyLabel: data.energyLabel,
            contextLabel: data.contextLabel,
            status: data.status || 'backlog'
        }
    })

    revalidatePath('/inbox')
    revalidatePath('/')
}

export async function getProjectsForSelect() {
    // Return flat list or hierarchy for select
    const projects = await prisma.project.findMany({
        where: { archived: false },
        orderBy: { name: 'asc' }
    })
    return projects
}
