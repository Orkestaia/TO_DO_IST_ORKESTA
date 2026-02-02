export type ParsedTask = {
    title: string;
    priority: string;   // 'P1' | 'P2' | 'P3' | 'P4'
    dueDate: Date | null;
}

export function parseTaskInput(input: string): ParsedTask {
    let title = input;
    let priority = 'P4';
    let dueDate: Date | null = null;

    // 1. Parse Priority (p1, p2, p3, p4 or !! !!! !)
    // Matches " p1", " p2" at end or middle, case insensitive
    const priorityRegex = /\s+(p[1-4])\b/i;
    const priorityMatch = title.match(priorityRegex);

    if (priorityMatch) {
        priority = priorityMatch[1].toUpperCase();
        title = title.replace(priorityRegex, '');
    }

    // 2. Parse Dates (Simple Spanish: hoy, mañana)
    // Basic implementation - can be expanded with date-fns or chrono-node later
    const lowerTitle = title.toLowerCase();

    if (/\b(hoy)\b/.test(lowerTitle)) {
        dueDate = new Date();
        // Remove " hoy " or " hoy" from title
        title = title.replace(/\bhoy\b/i, '');
    } else if (/\b(mañana)\b/.test(lowerTitle)) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        dueDate = d;
        title = title.replace(/\bmañana\b/i, '');
    }

    // Clean up extra spaces
    title = title.replace(/\s+/g, ' ').trim();

    return {
        title,
        priority,
        dueDate
    };
}
