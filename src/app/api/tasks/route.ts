import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // For demo, if userId is provided (staff), filter by it? 
        // Or if typical Kanban, maybe show all tasks involved?
        // Let's fallback to showing all tasks if no filter, or filter if provided.
        // Actually, for the board we likely want all team tasks or just ours.
        // Let's filter by userId if provided, otherwise all (admin view).

        const whereClause = userId ? { userId: parseInt(userId) } : {};

        const tasks = await prisma.task.findMany({
            where: whereClause,
            orderBy: { id: 'desc' }
        });

        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, priority, status, userId } = body;

        const task = await prisma.task.create({
            data: {
                title,
                priority,
                status,
                userId: parseInt(userId)
            }
        });

        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;

        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}
