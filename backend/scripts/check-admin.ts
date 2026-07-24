
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admins = await prisma.user.findMany({
        where: {
            role: 'ADMIN'
        },
        select: {
            username: true,
            email: true,
            role: true
        }
    });

    if (admins.length > 0) {
        console.log('Found Admin Users:');
        console.table(admins);
    } else {
        console.log('No ADMIN users found.');
        // Check for 'admin' username as fallback
        const potentialAdmin = await prisma.user.findUnique({
            where: { username: 'admin' }
        });
        if (potentialAdmin) {
            console.log('Found user with username "admin" but role is:', potentialAdmin.role);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
