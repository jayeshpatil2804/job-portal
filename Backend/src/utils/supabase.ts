import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

import path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const supabaseUrl = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
    console.error('SUPABASE_URL is missing!')
}

if (!serviceKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is missing! Uploads to private buckets will fail unless you have RLS policies.')
} else {
    console.log('✅ Supabase initialized with SERVICE_ROLE_KEY (RLS bypassed).')
}

export const supabase = createClient(
    supabaseUrl || '', 
    serviceKey || anonKey || ''
)
