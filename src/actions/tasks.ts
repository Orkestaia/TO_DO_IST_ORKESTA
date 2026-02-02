'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTodayTasks() {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    // Fetch tasks that are:
    // 1. Due today or before (overdue)
    // 2. OR In Progress (if we want to show all WIP in today)
    // 3. AND not done (unless we want to show completed today?) -> Usually we show completed today logic separately or filtered.

    // Let's get active tasks for now.
    const tasks = await prisma.task.findMany({
        where: {
            status: { not: 'done' },
            OR: [
                { dueDate: { lte: endOfDay } },
                { status: 'in_progress' }
            ]
        },
        include: {
            project: true
        },
        orderBy: [
            { priority: 'asc' }, // P1, P2...
            { dueDate: 'asc' }
        ]
    })

    return tasks
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'done' ? 'backlog' : 'done' // Simplification
    // If setting to done, set completedAt
    const data: any = { status: newStatus }
    if (newStatus === 'done') {
        data.completedAt = new Date()
    } else {
        data.completedAt = null
    }

    await prisma.task.update({
        where: { id },
        data
    })

    revalidatePath('/')
}
