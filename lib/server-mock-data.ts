/**
 * Generates a set of mock evaluations for demonstration purposes
 * This will be used when no real data is available in the database
 * This file is compatible with Server Components
 */
export function generateMockEvaluations() {
  const now = new Date();
  const evaluations = [];

  // Use a fixed seed for reproducible "randomness"
  const getRandomValue = (seed: number, max: number) => {
    // Simple deterministic random function
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  // Generate evaluations distributed over the past 30 days
  for (let i = 0; i < 120; i++) {
    const daysAgo = getRandomValue(i, 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const score = (getRandomValue(i + 100, 400) / 100 + 1).toFixed(2); // Score between 1.00 and 5.00
    const latency = getRandomValue(i + 200, 3000) + 100; // Latency between 100 and 3100ms
    
    const flags = [];
    // Deterministically add flags
    if (getRandomValue(i + 300, 100) > 80) {
      flags.push("unsafe_content");
    }
    if (getRandomValue(i + 400, 100) > 90) {
      flags.push("hallucination");
    }
    
    // Create a unique ID using a deterministic pattern
    const id = `mock-${i}-${getRandomValue(i + 500, 1000)}`;
    
    evaluations.push({
      id,
      interaction_id: `int-${id.substring(5, 15)}`,
      prompt: getSamplePrompt(i % samplePrompts.length),
      response: getSampleResponse(i % sampleResponses.length),
      score: Number(score),
      latency_ms: latency,
      flags,
      pii_tokens_redacted: getRandomValue(i + 600, 5),
      created_at: date.toISOString(),
    });
  }
  
  // Sort by date, most recent first
  return evaluations.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// Sample prompts for mock data
const samplePrompts = [
  "Generate a function to calculate the fibonacci sequence in JavaScript",
  "Write a React component that displays a counter with increment and decrement buttons",
  "Create a SQL query to retrieve all customers who made a purchase in the last 30 days",
  "Explain how to implement authentication with JWT in a Node.js application",
  "How do I configure a CI/CD pipeline for my GitHub repository?",
  "Write unit tests for a user registration function",
  "What's the best way to optimize database queries for a large dataset?",
  "Create a Python script that processes CSV files and generates reports",
  "How can I debug memory leaks in my web application?",
  "Create a responsive navigation menu with CSS and JavaScript",
  "What design patterns should I use for my e-commerce application?",
  "Write a bash script to automate deployment to AWS",
];

// Sample responses for mock data
const sampleResponses = [
  "Here's a JavaScript function that calculates the Fibonacci sequence using recursion with memoization for better performance:\n\n```javascript\nfunction fibonacci(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);\n  return memo[n];\n}\n```\n\nThis implementation avoids the exponential time complexity of naive recursive solutions.",
  "I'll create a React counter component with increment and decrement buttons:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className=\"counter\">\n      <h2>Counter: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n      <button onClick={() => setCount(count - 1)}>Decrement</button>\n    </div>\n  );\n}\n\nexport default Counter;\n```\n\nThis component uses the useState hook to manage the counter state.",
  "Here's a SQL query to retrieve customers who made purchases in the last 30 days:\n\n```sql\nSELECT DISTINCT c.customer_id, c.first_name, c.last_name, c.email\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nWHERE o.order_date >= DATEADD(day, -30, GETDATE())\nORDER BY c.last_name, c.first_name;\n```\n\nThis query joins the customers and orders tables and filters for orders placed within the last 30 days.",
  "To implement JWT authentication in a Node.js application:\n\n1. Install required packages: `npm install jsonwebtoken express bcrypt`\n\n2. Create a secret key for signing tokens\n\n3. Implement a login route that verifies credentials and issues a token:\n```javascript\napp.post('/login', async (req, res) => {\n  // Verify user credentials\n  const user = await findUserByEmail(req.body.email);\n  const validPassword = await bcrypt.compare(req.body.password, user.password);\n  \n  if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });\n  \n  // Create and sign the JWT\n  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {\n    expiresIn: '1h'\n  });\n  \n  res.json({ token });\n});\n```\n\n4. Create middleware to verify tokens on protected routes:\n```javascript\nfunction authenticateToken(req, res, next) {\n  const authHeader = req.headers['authorization'];\n  const token = authHeader && authHeader.split(' ')[1];\n  \n  if (!token) return res.status(401).json({ message: 'Access denied' });\n  \n  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {\n    if (err) return res.status(403).json({ message: 'Invalid token' });\n    req.user = user;\n    next();\n  });\n}\n```\n\n5. Apply the middleware to routes that require authentication:\n```javascript\napp.get('/protected', authenticateToken, (req, res) => {\n  res.json({ message: 'This is a protected route', user: req.user });\n});\n```\n\nThis setup provides a secure authentication system using JWTs.",
  "Here's how to optimize database queries for large datasets:\n\n1. **Use proper indexing**: Create indexes on columns used in WHERE, JOIN, and ORDER BY clauses.\n\n2. **Limit result sets**: Use pagination with LIMIT and OFFSET (or equivalent).\n\n3. **Query only what you need**: Avoid SELECT * and only retrieve required columns.\n\n4. **Use database-specific optimizations**: Consider partitioning, materialized views, or table clustering.\n\n5. **Analyze and optimize execution plans**: Use EXPLAIN to analyze query performance.\n\n6. **Consider caching**: Implement Redis or similar solutions for frequently accessed data.\n\n7. **Optimize JOIN operations**: Ensure efficient join conditions and consider denormalization where appropriate.\n\n8. **Batch processing**: Process large datasets in smaller chunks to prevent memory issues.\n\n9. **Regular maintenance**: Schedule vacuuming, statistics updates, and index rebuilds.\n\nImplement these strategies incrementally and measure performance improvements at each step.",
];

// Helper functions to get sample prompts and responses
function getSamplePrompt(index: number) {
  return samplePrompts[index % samplePrompts.length];
}

function getSampleResponse(index: number) {
  return sampleResponses[index % sampleResponses.length];
}