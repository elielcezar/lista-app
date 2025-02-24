import { PrismaClient } from '@prisma/client';
import { encryptionMiddleware } from './middleware.js';

const prisma = new PrismaClient();
prisma.$use(encryptionMiddleware);

export { prisma };