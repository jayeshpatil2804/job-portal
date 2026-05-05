import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const designations = [
    'Textile Designer',
    'Fashion Designer',
    'Production Manager',
    'Quality Control Inspector',
    'Merchandiser',
    'Pattern Maker',
    'Sourcing Manager',
    'Garment Technologist',
    'Machine Operator',
    'Plant Supervisor',
    'Weaving Technician',
    'Spinning Master',
    'Dyeing Supervisor'
]

async function main() {
    console.log('Seeding designations...')
    for (const name of designations) {
        await prisma.designation.upsert({
            where: { name },
            update: {},
            create: { name }
        })
        console.log(`Upserted designation: ${name}`)
    }
    console.log('Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
