import { supabase } from './supabase';

async function initStorage() {
    console.log('Initiating Storage Setup...');
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
        console.error('Error listing buckets:', listError.message);
        console.log('This usually means your SUPABASE_SERVICE_ROLE_KEY is incorrect or missing.');
        return;
    }

    const resumesBucket = buckets.find(b => b.name === 'resumes');

    if (!resumesBucket) {
        console.log('Bucket "resumes" not found, creating it...');
        const { error: createError } = await supabase.storage.createBucket('resumes', {
            public: true,
            allowedMimeTypes: ['application/pdf'],
            fileSizeLimit: 1024 * 1024 // 1MB
        });
        if (createError) console.error('Error creating bucket:', createError.message);
        else console.log('✅ Bucket "resumes" created successfully.');
    } else {
        console.log('Bucket "resumes" exists, ensuring it is public...');
        const { error: updateError } = await supabase.storage.updateBucket('resumes', {
            public: true
        });
        if (updateError) console.error('Error updating bucket:', updateError.message);
        else console.log('✅ Bucket "resumes" is now PUBLIC.');
    }

    console.log('\n--- IMPORTANT ---');
    console.log('If you still see RLS errors, please run this SQL in your Supabase SQL Editor:');
    console.log(`
      CREATE POLICY "Allow All" ON storage.objects FOR ALL USING ( bucket_id = 'resumes' );
    `);
}

initStorage();
