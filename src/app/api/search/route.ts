import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        const projectResults = await prisma.project.findMany({
            where: { title: { contains: query } },
            take: 3
        });

        const userResults = await prisma.user.findMany({
            where: { name: { contains: query } },
            take: 2
        });

        const invoiceResults = await prisma.invoice.findMany({
            where: { id: { contains: query } },
            take: 2
        });

        const results = [
            ...projectResults.map(p => ({ id: p.id, type: 'project', title: p.title, desc: p.status })),
            ...userResults.map(u => ({ id: u.id, type: 'user', title: u.name, desc: u.role })),
            ...invoiceResults.map(i => ({ id: i.id, type: 'invoice', title: i.id, desc: `$${i.amount} - ${i.status}` }))
        ];

        return NextResponse.json(results);

    } catch (error) {
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
