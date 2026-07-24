import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');
        const userId = searchParams.get('userId');

        // 1. Calculate Revenue Chart Data (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const invoices = await prisma.invoice.findMany({
            where: {
                status: 'paid',
                date: { gte: sixMonthsAgo }
            },
            orderBy: { date: 'asc' }
        });

        // Aggregate by month
        const revenueMap: Record<string, number> = {};
        invoices.forEach(inv => {
            const month = inv.date.toLocaleString('default', { month: 'short' });
            revenueMap[month] = (revenueMap[month] || 0) + inv.amount;
        });

        const chartData = Object.entries(revenueMap).map(([name, revenue]) => ({ name, revenue }));

        // 2. Calculate Stats
        const totalRevenue = await prisma.invoice.aggregate({
            _sum: { amount: true },
            where: { status: 'paid' }
        });

        const totalClients = await prisma.user.count({ where: { role: 'client' } });
        const activeProjects = await prisma.project.count({ where: { status: 'In Progress' } });
        const pendingTasks = await prisma.task.count({ where: { status: { not: 'Done' } } });

        // Staff specific stats
        let myActiveProjects = 0;
        let myDueTasks = 0;
        let myCompletedTasks = 0;

        if (userId) {
            const uid = parseInt(userId);
            myActiveProjects = await prisma.project.count({ where: { userId: uid, status: 'In Progress' } });
            myDueTasks = await prisma.task.count({ where: { userId: uid, status: { not: 'Done' } } });
            myCompletedTasks = await prisma.task.count({ where: { userId: uid, status: 'Done' } });
        }

        return NextResponse.json({
            chartData,
            stats: {
                totalRevenue: totalRevenue._sum.amount || 0,
                totalClients,
                activeProjects,
                pendingTasks,
                staffStats: {
                    myActiveProjects,
                    myDueTasks,
                    myCompletedTasks
                }
            }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
