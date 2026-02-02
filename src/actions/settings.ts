'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateSettings(data: any) {
    // Update the singleton settings (id=1)
    // Ensure types match schema
    await prisma.settings.update({
        where: { id: 1 },
        data: {
            primaryColor: data.primaryColor,
            accentColor: data.accentColor,
            darkMode: data.darkMode,
            gamification: data.gamification,
            soundEnabled: data.soundEnabled
            // tasksPerDay etc. if needed
        }
    })

    revalidatePath('/settings')
    revalidatePath('/') // Revalidate root for color changes if they were server applied (they are not, but good practice)
}

export async function getSettings() {
    return await prisma.settings.findUnique({ where: { id: 1 } })
}
