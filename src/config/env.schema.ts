import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().default('http://localhost:3001'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_DATABASE: z.string().default('galery_mother'),
  DB_SYNCHRONIZE: z.enum(['true', 'false']).default('true'),
  JWT_SECRET: z.string().min(12).default('change-me-in-production'),
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_PASSWORD: z.string().default('admin123456'),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_PUBLIC_BASE_URL: z.string().optional(),
  WHATSAPP_NUMBER: z.string().default('5500000000000'),
});

export function validateEnv(config: Record<string, unknown>) {
  return envSchema.parse(config);
}
