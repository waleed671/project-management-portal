const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning database...');

    // Delete in order of dependencies (child tables first)
    await prisma.notification.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();

    // Finally delete users
    await prisma.user.deleteMany();

    console.log('All data deleted successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
