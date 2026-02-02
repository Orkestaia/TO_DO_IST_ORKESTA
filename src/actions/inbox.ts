'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createInboxTask(title: string, priority: string = 'P4', dueDate: Date | null = null) {
    // Find Inbox project
    const inboxProject = await prisma.project.findFirst({
        where: { name: '05_INBOX' } // Depending on seed
    })

    // Or maybe "Captura" subproject?
    // Seed: 05_INBOX -> children: ['Captura']
    // Let's put it in "Captura" if found, else Inbox root.

    let targetProjectId = inboxProject?.id

    const captureProject = await prisma.project.findFirst({
        where: { name: 'Captura', parentId: inboxProject?.id }
    })

    if (captureProject) {
        targetProjectId = captureProject.id
    }

    await prisma.task.create({
        data: {
            title,
            status: 'backlog',
            projectId: targetProjectId,
            priority,
            dueDate,
            isInbox: true // Explicitly mark as inbox item
        }
    })

    revalidatePath('/inbox')
    revalidatePath('/')
}

export async function getInboxTasks() {
    // Find all tasks in Inbox project or its children
    // Better: find projects under "05_INBOX" (root & children)

    return await prisma.task.findMany({
        where: {
            project: {
                OR: [
                    { name: '05_INBOX' },
                    { parent: { name: '05_INBOX' } }
                ]
            },
            status: { not: 'done' }
        },
        orderBy: { createdAt: 'desc' }
    })
}
