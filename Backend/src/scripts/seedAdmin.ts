import 'dotenv/config'
import bcrypt from 'bcryptjs'
import prisma from '../config/db'

async function seedAdmin() {
    try {
        console.log('Dotenv loaded!')
        const email = process.argv[2] || 'admin@losodhan.in'
        const password = process.argv[3] || 'Admin@1234'
        const fullName = 'Super Admin'

        console.log(`Checking for admin: ${email}...`)
        console.log('Connecting to Prisma...')

        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        })

        if (existingAdmin) {
            console.log('Admin already exists!')
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            await prisma.admin.create({
                data: {
                    email,
                    password: hashedPassword,
                    fullName,
                    isSuperAdmin: true,
                    isVerified: true,
                    role: 'ADMIN',
                    permissions: [
                        'RECRUITER_APPROVAL',
                        'JOB_MODERATION',
                        'CANDIDATE_MANAGEMENT',
                        'SUB_ADMIN_MANAGEMENT',
                        'REPORTS'
                    ]
                }
            })

            console.log('✅ Super Admin created successfully!')
            console.log(`Email: ${email}`)
            console.log(`Password: ${password}`)
        }

        // Seed default departments
        const departments = [
            'IT & Software',
            'Human Resources',
            'Marketing',
            'Sales',
            'Finance',
            'Operations',
            'Design',
            'Customer Support',
            'Legal',
            'Management'
        ]

        console.log('Seeding departments...')
        for (const deptName of departments) {
            await prisma.department.upsert({
                where: { name: deptName },
                update: {},
                create: { name: deptName }
            })
        }
        console.log('✅ Departments seeded successfully!')

    } catch (error) {
        console.error('Error seeding admin:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedAdmin()
