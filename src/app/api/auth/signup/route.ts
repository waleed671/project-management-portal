import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'client' // Default to client if not specified
            }
        });

        return NextResponse.json({ message: 'User created', userId: user.id });

    } catch (e) {
        return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
    }
}
