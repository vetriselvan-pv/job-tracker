import 'dotenv/config';
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

const connection = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({connectionString : connection});

const prisma = new PrismaClient({adapter});

export { prisma }