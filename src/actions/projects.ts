'use server'

import { prisma } from '@/lib/prisma'

export async function getProjectsConfig() {
    const projects = await prisma.project.findMany({
        where: { parentId: null, archived: false },
        include: {
            children: {
                where: { archived: false },
                orderBy: { name: 'asc' }
            }
        },
        orderBy: { name: 'asc' }
    })
    return projects
}
