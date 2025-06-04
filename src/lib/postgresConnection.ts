import { PrismaClient } from "../../generated/prisma";

const prismaClient = () => {
    return new PrismaClient()
}

const globalPrisma = global as unknown as {prisma: PrismaClient | undefined}

const prisma = globalPrisma.prisma || prismaClient()

export default prisma