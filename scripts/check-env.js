// Environment validation script
// Run this to check if your .env.local is configured correctly

require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Checking Environment Configuration...\n');

let allGood = true;

// Check NEXT_PUBLIC_SUPABASE_URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl || supabaseUrl === 'your-supabase-url-here') {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL is not configured');
  console.log('   Go to Supabase Dashboard → Settings → API → Project URL\n');
  allGood = false;
} else if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('supabase.co')) {
  console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL looks incorrect');
  console.log('   It should look like: https://abcdefgh.supabase.co\n');
  allGood = false;
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is configured');
}

// Check NEXT_PUBLIC_SUPABASE_ANON_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!anonKey || anonKey === 'your-supabase-anon-key-here') {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
  console.log('   Go to Supabase Dashboard → Settings → API → anon public key\n');
  allGood = false;
} else if (!anonKey.startsWith('eyJ')) {
  console.log('⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY looks incorrect');
  console.log('   It should start with "eyJ"\n');
  allGood = false;
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is configured');
}

// Check SUPABASE_SERVICE_ROLE_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceKey || serviceKey === 'your-supabase-service-role-key-here') {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY is not configured');
  console.log('   Go to Supabase Dashboard → Settings → API → service_role key (click Reveal)\n');
  allGood = false;
} else if (!serviceKey.startsWith('eyJ')) {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY looks incorrect');
  console.log('   It should start with "eyJ"\n');
  allGood = false;
} else {
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY is configured');
}

console.log('\n' + '='.repeat(60) + '\n');

if (allGood) {
  console.log('🎉 All environment variables are configured correctly!');
  console.log('\nYou can now run: npm run dev\n');
} else {
  console.log('⚠️  Please configure the missing environment variables in .env.local');
  console.log('\nInstructions:');
  console.log('1. Go to https://supabase.com');
  console.log('2. Open your project');
  console.log('3. Go to Settings (⚙️) → API');
  console.log('4. Copy the values to your .env.local file');
  console.log('\nSee CHECKLIST.md for detailed instructions.\n');
}
