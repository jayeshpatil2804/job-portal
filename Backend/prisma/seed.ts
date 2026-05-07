import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const departments = [
  'Human Resources',
  'Information Technology',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Customer Support',
  'Engineering',
  'Design',
  'Product Management',
  'Quality Assurance',
  'Legal',
  'Administration',
  'Logistics',
  'Research and Development',
  'Healthcare',
  'Education',
  'Construction',
  'Manufacturing',
  'Hospitality'
]

async function main() {
  console.log('Seeding departments...')

  for (const name of departments) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }

  console.log(`Successfully seeded ${departments.length} departments.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
