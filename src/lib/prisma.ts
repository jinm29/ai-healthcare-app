import {PrismaClient} from "@prisma/client";

export function createPrismaClient() {
    return new PrismaClient({
        log: ['warn', 'error']
    });
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof createPrismaClient>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? createPrismaClient()

export default prisma
export {Prisma} from "@prisma/client";

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
