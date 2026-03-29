const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  console.log('Attempting to connect...')
  await prisma.$connect()
  console.log('Connected successfully!')
  const res = await prisma.$queryRaw`SELECT current_database()`
  console.log('Database:', res)
  await prisma.$disconnect()
}
main().catch(err => {
  console.error('Connection failed:', err)
  process.exit(1)
})
