import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Helper to verify token
async function verifyToken(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        const decoded = await verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailAlerts: true,
                projectUpdates: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Internal User Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const decoded = await verifyToken(req);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        // Allow updating name and settings. Email/Role are usually restricted or require special flows.
        const { name, emailAlerts, projectUpdates } = body;

        const updatedUser = await prisma.user.update({
            where: { id: decoded.id },
            data: {
                name,
                emailAlerts,
                projectUpdates
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailAlerts: true,
                projectUpdates: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
