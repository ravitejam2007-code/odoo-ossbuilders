import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateEmployeeLoginId } from './utils/idGenerator';
import { env } from './config/env';
import { isMailerConfigured } from './config/mailer';

async function testPhase1() {
  console.log('--- RUNNING PHASE 1 TEST SUITE ---');

  // Test 1: Brevo SMTP Configuration Check
  console.log('\n[Test 1] Checking Brevo SMTP Host & Config:');
  console.log(`Host: ${env.BREVO_SMTP_HOST} (Port ${env.BREVO_SMTP_PORT})`);
  console.log(`Brevo User: ${env.BREVO_USERNAME || '(Not provided yet)'}`);
  console.log(`Brevo Configured: ${isMailerConfigured() ? 'YES' : 'SIMULATION MODE (Ready for keys)'}`);

  // Test 2: Login ID Generation Format
  console.log('\n[Test 2] Testing Login ID Generator:');
  const sample1 = generateEmployeeLoginId('Dayflow Tech', 'John Doe', 2026, 1);
  const sample2 = generateEmployeeLoginId('Odoo Inc', 'Ravi Teja', 2026, 42);
  console.log(`Generated ID 1: ${sample1} (Expected format e.g. DAJODO20260001)`);
  console.log(`Generated ID 2: ${sample2} (Expected format e.g. OIRATE20260042)`);

  if (!sample1.startsWith('DA') || !sample1.includes('20260001')) {
    throw new Error('Login ID generation failed for Sample 1');
  }

  // Test 3: Password Hashing (bcrypt cost 10)
  console.log('\n[Test 3] Testing Bcrypt Password Hashing & Verification:');
  const testPassword = 'Password@1234';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(testPassword, salt);
  console.log(`Password Hash: ${hash.slice(0, 25)}...`);

  const isValidMatch = await bcrypt.compare(testPassword, hash);
  const isInvalidMatch = await bcrypt.compare('WrongPassword', hash);
  console.log(`Correct password matches: ${isValidMatch}`);
  console.log(`Wrong password rejected: ${!isInvalidMatch}`);

  if (!isValidMatch || isInvalidMatch) {
    throw new Error('Password verification logic failed');
  }

  // Test 4: JWT Token Issuance & Verification
  console.log('\n[Test 4] Testing JWT Access & Refresh Token Signing:');
  const payload = {
    id: 'e0000000-0000-0000-0000-000000000002',
    loginId: sample1,
    email: 'john.doe@company.com',
    role: 'employee' as const,
    emailVerified: true,
  };

  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  const decodedAccess = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as any;
  const decodedRefresh = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as any;

  console.log(`Access Token Decoded Login ID: ${decodedAccess.loginId}`);
  console.log(`Refresh Token Decoded User ID: ${decodedRefresh.id}`);

  if (decodedAccess.loginId !== sample1 || decodedRefresh.id !== payload.id) {
    throw new Error('JWT signing/verification mismatch');
  }

  console.log('\n========================================');
  console.log('🎉 ALL PHASE 1 TESTS PASSED SUCCESSFULLY!');
  console.log('========================================');
}

testPhase1().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
