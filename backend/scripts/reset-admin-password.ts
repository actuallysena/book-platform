
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const username = 'john_doe'; // The admin user we found
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        const user = await prisma.user.update({
            where: { username: username },
            data: { password: hashedPassword },
        });
        console.log(`Password for user '${user.username}' (Role: ${user.role}) has been reset to '${newPassword}'`);
    } catch (error) {
        console.error(`Failed to update user '${username}':`, error);
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
