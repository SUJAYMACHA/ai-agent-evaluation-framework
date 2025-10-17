require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a test user
async function createTestUser() {
  const email = 'test@example.com';
  const password = 'TestPassword123!';

  console.log('Creating test user...');
  
  // Try to sign in first
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInData?.user) {
    console.log('Test user already exists:', email);
    return signInData.user;
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error('Error creating test user:', error);
    throw error;
  }

  console.log('Test user created successfully:', email);
  console.log('User ID:', data.user.id);
  return data.user;
}

// Generate realistic evaluation data
function generateEvaluation(userId) {
  const prompts = [
    'Explain quantum computing in simple terms',
    'What are the best practices for React development?',
    'How do I optimize SQL queries?',
    'Describe the differences between REST and GraphQL',
    'What is machine learning?',
    'How does blockchain technology work?',
    'Explain Docker containers',
    'What are microservices?',
    'How to implement authentication in Node.js?',
    'What is CI/CD pipeline?',
  ];

  const responseTemplates = [
    'Quantum computing is a type of computing that uses quantum-mechanical phenomena...',
    'React best practices include using functional components, hooks, proper state management...',
    'To optimize SQL queries, you should use indexes, avoid SELECT *, use JOINs efficiently...',
    'REST uses standard HTTP methods while GraphQL uses a query language...',
    'Machine learning is a subset of artificial intelligence that enables systems to learn...',
    'Blockchain is a distributed ledger technology that records transactions...',
    'Docker containers are lightweight, portable units that package applications...',
    'Microservices are an architectural approach where applications are built as small services...',
    'Authentication in Node.js can be implemented using JWT, sessions, or OAuth...',
    'CI/CD is a method to frequently deliver apps by introducing automation...',
  ];

  const flags = [
    [],
    [],
    [],
    [],
    ['pii_detected'],
    ['failed'],
    ['timeout'],
    ['low_confidence'],
  ];

  const prompt = faker.helpers.arrayElement(prompts);
  const response = faker.helpers.arrayElement(responseTemplates) + ' ' + faker.lorem.paragraph();
  const score = faker.number.float({ min: 0.3, max: 1.0, precision: 0.01 });
  const latency_ms = faker.number.int({ min: 100, max: 5000 });
  const selectedFlags = faker.helpers.arrayElement(flags);
  const pii_tokens_redacted = selectedFlags.includes('pii_detected') 
    ? faker.number.int({ min: 1, max: 10 }) 
    : 0;

  return {
    user_id: userId,
    interaction_id: faker.string.uuid(),
    prompt,
    response,
    score,
    latency_ms,
    flags: selectedFlags,
    pii_tokens_redacted,
    created_at: faker.date.between({ 
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      to: new Date() 
    }).toISOString(),
  };
}

// Seed evaluations
async function seedEvaluations(userId, count = 20000) {
  console.log(`\nGenerating ${count} evaluation records...`);
  
  const batchSize = 1000;
  const batches = Math.ceil(count / batchSize);

  for (let i = 0; i < batches; i++) {
    const currentBatchSize = Math.min(batchSize, count - i * batchSize);
    const evaluations = Array.from({ length: currentBatchSize }, () => 
      generateEvaluation(userId)
    );

    console.log(`Inserting batch ${i + 1}/${batches} (${currentBatchSize} records)...`);

    const { error } = await supabase
      .from('evaluations')
      .insert(evaluations);

    if (error) {
      console.error('Error inserting evaluations:', error);
      throw error;
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Successfully inserted ${count} evaluation records!`);
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting seed script...\n');

    const user = await createTestUser();
    await seedEvaluations(user.id, 20000);

    console.log('\n✨ Seed script completed successfully!');
    console.log('\n📝 Test User Credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: TestPassword123!');
  } catch (error) {
    console.error('\n❌ Seed script failed:', error);
    process.exit(1);
  }
}

main();
