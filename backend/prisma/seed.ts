import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const john = await prisma.user.create({
    data: {
      username: 'john',
      password: 'password',
      name: 'John Doe',
      videos: {
        create: [
          {
            videoUrl: 'https://www.youtube.com/watch?v=example1',
            title: "John's First Video",
          },
          {
            videoUrl: 'https://www.youtube.com/watch?v=example2',
            title: "John's Second Video",
          },
        ],
      },
    },
    include: {
      videos: true,
    },
  });

  const jane = await prisma.user.create({
    data: {
      username: 'jane',
      password: 'password',
      name: 'Jane Smith',
      videos: {
        create: [
          {
            videoUrl: 'https://www.youtube.com/watch?v=example3',
            title: "Jane's First Video",
          },
        ],
      },
    },
    include: {
      videos: true,
    },
  });

  await prisma.share.create({
    data: {
      userId: john.id,
      videoId: john.videos[0].id,
    },
  });

  await prisma.share.create({
    data: {
      userId: john.id,
      videoId: jane.videos[0].id,
    },
  });

  await prisma.share.create({
    data: {
      userId: jane.id,
      videoId: john.videos[1].id,
    },
  });

  console.log(`Created user: ${john.username} with id: ${john.id}`);
  console.log(`Created user: ${jane.username} with id: ${jane.id}`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
