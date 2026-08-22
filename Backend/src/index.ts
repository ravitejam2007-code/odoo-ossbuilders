import app from './app';
import { env } from './config/env';
import { isMailerConfigured } from './config/mailer';

const PORT = env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Dayflow HRMS Backend API Server Started`);
  console.log(`📡 URL: http://localhost:${PORT}/api/v1/health`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`✉️ Brevo SMTP: ${isMailerConfigured() ? 'CONFIGURED & READY' : 'SIMULATION MODE (Missing Credentials)'}`);
  console.log(`====================================================`);
});

// Handle unhandled rejections and termination signals
process.on('unhandledRejection', (err: any) => {
  console.error('[Fatal Unhandled Rejection]:', err);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
