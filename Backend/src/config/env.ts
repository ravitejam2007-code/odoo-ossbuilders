import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(s => s.trim()) : ['https://odoo-ossbuilders.vercel.app', 'http://localhost:4321', 'http://localhost:5173', 'http://localhost:3000'],
  
  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dayflow_default_dev_access_secret_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dayflow_default_dev_refresh_secret_2026',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://hkxfldkkmmyymmalyqqi.supabase.co',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Brevo Custom SMTP (Simplified to just 2 fields: Username & SMTP Key)
  BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  BREVO_SMTP_PORT: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
  BREVO_USERNAME: process.env.BREVO_USERNAME || process.env.BREVO_SMTP_USER || '',
  BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY || process.env.BREVO_SMTP_PASS || '',
  BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL || process.env.BREVO_USERNAME || 'notifications@dayflow.local',
  BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || 'Dayflow HRMS'
};
