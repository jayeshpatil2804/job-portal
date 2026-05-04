
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function count() {
  try {
    const skillsCount = await prisma.skill.count();
    const designationsCount = await prisma.designation.count();
    const jobsCount = await prisma.job.count();
    const usersCount = await prisma.candidate.count() + await prisma.recruiter.count();
    
    console.log('Skills:', skillsCount);
    console.log('Designations:', designationsCount);
    console.log('Jobs:', jobsCount);
    console.log('Users:', usersCount);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

count();
