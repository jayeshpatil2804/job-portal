import prisma from '../config/db'

async function main() {
    try {
        console.log('Checking Designation model...')
        const designations = await (prisma as any).designation.findMany()
        console.log('Designations:', designations)
        
        console.log('Checking Skill model...')
        const skills = await (prisma as any).skill.findMany()
        console.log('Skills:', skills)
    } catch (error) {
        console.error('Error checking Prisma models:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
