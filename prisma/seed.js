const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing database...');
    await prisma.notification.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.project.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    console.log('Database cleared. Seeding...');

    const password = await bcrypt.hash('123456', 10);

    // 1. Users
    const admin = await prisma.user.create({
        data: {
            email: 'admin@portal.com',
            name: 'Admin User',
            password,
            role: 'admin',
        },
    });

    const staff = await prisma.user.create({
        data: {
            email: 'staff@portal.com',
            name: 'Sarah Stick',
            password,
            role: 'staff',
        },
    });

    const client = await prisma.user.create({
        data: {
            email: 'client@portal.com',
            name: 'Acme Corp',
            password,
            role: 'client',
        },
    });

    const client2 = await prisma.user.create({
        data: {
            email: 'globex@portal.com',
            name: 'Globex Inc',
            password,
            role: 'client',
        },
    });

    // 2. Projects
    console.log('Seeding projects...');
    await prisma.project.createMany({
        data: [
            { title: 'Live DB Integration', clientName: 'Acme Corp', status: 'In Progress', deadline: new Date('2026-12-15'), progress: 65, userId: staff.id },
            { title: 'Real-Time Analytics Dashboard', clientName: 'Globex Inc', status: 'Pending', deadline: new Date('2026-11-30'), progress: 10, userId: staff.id },
            { title: 'Database Migration v2', clientName: 'Initech', status: 'Completed', deadline: new Date('2026-09-20'), progress: 100, userId: staff.id },
            { title: 'Cloud Infrastructure Setup', clientName: 'Acme Corp', status: 'In Progress', deadline: new Date('2027-01-10'), progress: 40, userId: staff.id },
        ]
    });

    // 3. Invoices (Revenue Data)
    console.log('Seeding invoices...');
    const months = ['2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01'];
    const invoices = [];

    // Past 6 months data for charts
    for (const month of months) {
        const date = new Date(`${month}-15`);
        // Random 1-3 invoices per month
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            invoices.push({
                id: `INV-${month.replace('-', '')}-${i + 100}`,
                amount: Math.floor(Math.random() * 4000) + 1000,
                status: 'paid',
                description: `Monthly Service - ${month}`,
                date: date,
                userId: Math.random() > 0.5 ? client.id : client2.id
            });
        }
    }
    // Add some pending ones
    invoices.push({ id: 'INV-PEND-001', amount: 2500, status: 'pending', description: 'Q1 Retainer', date: new Date(), userId: client.id });

    for (const inv of invoices) {
        await prisma.invoice.create({ data: inv });
    }

    // 4. Tasks
    console.log('Seeding tasks...');
    await prisma.task.createMany({
        data: [
            { title: 'Fix Navigation Bug', priority: 'High', status: 'To Do', userId: staff.id },
            { title: 'Design Home Mockups', priority: 'Medium', status: 'In Progress', userId: staff.id },
            { title: 'Setup CI/CD Pipeline', priority: 'High', status: 'Done', userId: staff.id },
            { title: 'Update Client Documentation', priority: 'Low', status: 'To Do', userId: staff.id },
        ]
    });

    // 5. Notifications
    console.log('Seeding notifications...');
    await prisma.notification.createMany({
        data: [
            { text: 'New Project Assigned: Website Redesign', type: 'info', userId: staff.id },
            { text: 'Invoice #402 Paid', type: 'success', userId: admin.id },
            { text: 'Server Maintenance Scheduled', type: 'warning', userId: admin.id },
            { text: 'Welcome to your dashboard', type: 'info', userId: client.id },
            { text: 'Project "Mobile App" updated', type: 'info', userId: admin.id },
        ]
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
