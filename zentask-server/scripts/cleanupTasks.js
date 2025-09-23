const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allowed = ["todo", "inprogress", "done"];

  const tasks = await prisma.task.findMany();
  for (const task of tasks) {
    if (!allowed.includes(task.status)) {
      console.log(`Fixing task ${task.id} (invalid status: ${task.status})`);
      await prisma.task.update({
        where: { id: task.id },
        data: { status: "todo" }, // fallback
      });
    }
  }
  console.log("Cleanup complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());