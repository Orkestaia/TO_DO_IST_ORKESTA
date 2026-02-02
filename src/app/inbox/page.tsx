import { getInboxTasks } from "@/actions/inbox"
import { getProjectsForSelect } from "@/actions/process"
import { InboxClient } from "@/components/features/inbox/InboxClient"

export default async function InboxPage() {
    const tasks = await getInboxTasks()
    const projects = await getProjectsForSelect()

    // Serialize inputs
    const serializedTasks = tasks.map(t => ({
        ...t,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        completedAt: t.completedAt ? t.completedAt.toISOString() : null,
        // Project might be null or simplified
        project: null
    }))

    return <InboxClient tasks={serializedTasks} projects={projects} />
}
