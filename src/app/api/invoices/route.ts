import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const role = searchParams.get('role');

        let whereClause = {};
        if (role === 'client' && userId) {
            whereClause = { userId: parseInt(userId) };
        }

        const invoices = await prisma.invoice.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            include: { user: { select: { name: true } } }
        });

        // Format date for frontend
        const formatted = invoices.map(inv => ({
            ...inv,
            date: inv.date.toISOString().split('T')[0]
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, description, userId, dueDate } = body;

        // Generate ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000);
        const id = `INV-${dateStr}-${random}`;

        // Validate User existence
        const userExists = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
        if (!userExists) {
            return NextResponse.json({ error: `User ID ${userId} does not exist found` }, { status: 400 });
        }

        const invoice = await prisma.invoice.create({
            data: {
                id,
                amount: parseFloat(amount),
                description,
                status: 'pending',
                date: dueDate ? new Date(dueDate) : new Date(),
                userId: parseInt(userId)
            }
        });

        return NextResponse.json(invoice);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create invoice. Ensure User ID exists (Foreign Key).' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;

        const invoice = await prisma.invoice.update({
            where: { id: id },
            data: { status }
        });

        return NextResponse.json(invoice);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
}
