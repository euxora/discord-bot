import { prisma } from '#prisma';

async function main(): Promise<void> {
  console.log('Seeding database...');
  // Add seed data here
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
