import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');
        const userId = searchParams.get('userId');

        let whereClause = {};

        // Role-based filtering
        if (role === 'staff' && userId) {
            whereClause = { userId: parseInt(userId) };
        } else if (role === 'client') {
            // For clients, filter by ClientName matching their user name (simplified linkage)
            // In a real app, Client User ID should be linked to Project directly.
            // For now, return all projects for demo or assume client can see status.
            // Let's return all for client visibility in this demo context.
        }

        const projects = await prisma.project.findMany({
            where: whereClause,
            orderBy: { deadline: 'asc' },
            include: { user: { select: { name: true } } }
        });

        // Format dates for frontend
        const formatted = projects.map(p => ({
            ...p,
            deadline: p.deadline.toISOString().split('T')[0]
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, clientName, status, deadline, userId } = body;

        const project = await prisma.project.create({
            data: {
                title,
                clientName,
                status: status || 'Pending',
                deadline: new Date(deadline),
                userId: userId ? parseInt(userId) : null,
                progress: 0
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, clientName, status, deadline, userId } = body;

        const updatedProject = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                title,
                clientName,
                status,
                deadline: new Date(deadline),
                userId: userId ? parseInt(userId) : null
            }
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.project.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
