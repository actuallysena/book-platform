
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
    { name: 'Fantastik', slug: 'fantastik', color: 'bg-purple-500/10' },
    { name: 'Romantik', slug: 'romantik', color: 'bg-pink-500/10' },
    { name: 'Gizem', slug: 'gizem', color: 'bg-indigo-500/10' },
    { name: 'Bilim Kurgu', slug: 'bilim-kurgu', color: 'bg-cyan-500/10' },
    { name: 'Gerilim', slug: 'gerilim', color: 'bg-red-500/10' },
    { name: 'Korku', slug: 'korku', color: 'bg-gray-900/10' },
    { name: 'Macera', slug: 'macera', color: 'bg-green-500/10' },
    { name: 'Dram', slug: 'dram', color: 'bg-yellow-500/10' },
    { name: 'Genç Yetişkin', slug: 'genc-yetiskin', color: 'bg-orange-500/10' },
    { name: 'Tarihi', slug: 'tarihi', color: 'bg-amber-700/10' },
    { name: 'Çağdaş', slug: 'cagdas', color: 'bg-blue-500/10' },
    { name: 'Doğaüstü', slug: 'dogaustu', color: 'bg-violet-500/10' },
];

async function main() {
    console.log('Start seeding categories...');

    for (const cat of categories) {
        const exists = await prisma.category.findUnique({
            where: { slug: cat.slug },
        });

        if (!exists) {
            await prisma.category.create({
                data: cat,
            });
            console.log(`Created category: ${cat.name}`);
        } else {
            console.log(`Category already exists: ${cat.name}`);
        }
    }

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
