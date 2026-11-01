import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
  return value;
}

export const config = {
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  resendApiKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'NeuroNetworks <onboarding@resend.dev>',
  port: Number(process.env.PORT) || 4000,
  isProduction: process.env.NODE_ENV === 'production',
};
