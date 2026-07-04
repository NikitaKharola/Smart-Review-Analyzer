const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient instance across the app (avoids exhausting
// database connections when Node hot-reloads or many requests come in).
const prisma = new PrismaClient();

module.exports = prisma;
