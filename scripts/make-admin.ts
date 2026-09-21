/**
 * Promotes an existing user to the ADMIN role.
 *
 * Usage:
 *   npm run make-admin -- you@example.com
 *
 * The user must have already registered a normal account at /register
 * before running this script.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: npm run make-admin -- <email>");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    console.error(
      `No user found with email "${normalizedEmail}". Register an account at /register first.`
    );
    process.exit(1);
  }

  if (user.role === "ADMIN") {
    console.log(`${normalizedEmail} is already an admin.`);
    process.exit(0);
  }

  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { role: "ADMIN" },
  });

  console.log(`✅ ${normalizedEmail} is now an admin.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
