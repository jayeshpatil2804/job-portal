import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('--- CANDIDATES ---')
    const candidates = await prisma.candidate.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    })
    console.log(JSON.stringify(candidates, null, 2))

    console.log('\n--- RECRUITERS ---')
    const recruiters = await prisma.recruiter.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    })
    console.log(JSON.stringify(recruiters, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
