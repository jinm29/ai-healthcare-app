import {PrismaClient} from '@prisma/client'
import assistantModeSeed from './data/assistant-mode.json'

const prisma = new PrismaClient()

async function main() {
    await prisma.assistantMode.createMany({
        data: assistantModeSeed,
        skipDuplicates: true
    });

    const personalInfo = await prisma.healthData.findFirst({where: {type: 'PERSONAL_INFO'}})
    if (!personalInfo) {
        await prisma.healthData.create({data: {type: 'PERSONAL_INFO', data: {}}})
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
