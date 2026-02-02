import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Default Settings
    await prisma.settings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            primaryColor: '#814AC8',
            accentColor: '#23475B',
            darkMode: true,
            gamification: true,
            soundEnabled: false
        }
    })

    // 2. Clear existing (optional, but good for idempotent seed if fresh)
    // await prisma.project.deleteMany({}) 

    // 3. Create Project Hierarchy
    const hierarchy = [
        {
            name: '01_EMPRESA',
            children: ['Visión & Estrategia', 'Ideas (Backlog)', 'Marketing & Growth', 'Automatizaciones & IA', 'Servicios & Pricing', 'Contenido', 'Formación']
        },
        {
            name: '02_CLIENTES',
            children: ['Quick RX', 'WFP', 'Clínica Ortodoncia Pablo', 'Sutan Cook'],
            wipLimit: 5 // Default for Client projects
        },
        {
            name: '03_PERSONAL',
            children: ['Salud & Deporte', 'Hogar', 'Familia']
        },
        {
            name: '04_ADMIN & SISTEMA',
            children: ['Finanzas / Facturación', 'Gastos', 'Impuestos', 'Plantillas / SOP', 'Mantenimiento del sistema']
        },
        {
            name: '05_INBOX',
            children: ['Captura']
        }
    ]

    for (const group of hierarchy) {
        const parent = await prisma.project.create({
            data: {
                name: group.name,
                wipLimit: group.wipLimit,
            }
        })

        console.log(`Created parent: ${group.name}`)

        if (group.children) {
            for (const childName of group.children) {
                await prisma.project.create({
                    data: {
                        name: childName,
                        parentId: parent.id,
                        // If it's a client sub-project, maybe apply WIP limit logic? 
                        // Prompt says "Kanban por cliente", implying the child projects are the clients. 
                        // Hierarchy says "02_CLIENTES" -> "Quick RX". So Quick RX is the board.
                        wipLimit: group.wipLimit && (group.name === '02_CLIENTES') ? 5 : undefined
                    }
                })
            }
        }
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
