'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function moveTask(taskId: string, newStatus: string, projectId: string) {
    // Check WIP limit if moving to 'in_progress'
    if (newStatus === 'in_progress') {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { tasks: { where: { status: 'in_progress' } } }
        })

        // Check global settings limit? Prompt says "Configurar WIP limit global (default 5) y por cliente"
        // For now check Project limit
        const limit = project?.wipLimit || 5
        if (project && project.tasks.length >= limit) {
            // Return error or handle it. Server actions can return values.
            return { success: false, error: 'WIP Limit Reached' }
        }
    }

    await prisma.task.update({
        where: { id: taskId },
        data: {
            status: newStatus,
            completedAt: newStatus === 'done' ? new Date() : null
        }
    })

    revalidatePath(`/project/${projectId}`)
    return { success: true }
}
