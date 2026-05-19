import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { z } from 'zod';
import { validateEnv } from '../config/env.schema';
import { ENTITIES } from './entities';
import { InitialSchema1763424000000 } from './migrations/1763424000000-InitialSchema';

const emptyToUndefined = (value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
};

const databaseEnvSchema = z.object({
  DATABASE_URL: z.preprocess(emptyToUndefined, z.string().optional()),
  DB_HOST: z.preprocess(emptyToUndefined, z.string().default('localhost')),
  DB_PORT: z.preprocess(emptyToUndefined, z.coerce.number().default(5432)),
  DB_USERNAME: z.preprocess(emptyToUndefined, z.string().default('postgres')),
  DB_PASSWORD: z.preprocess(emptyToUndefined, z.string().default('postgres')),
  DB_DATABASE: z.preprocess(
    emptyToUndefined,
    z.string().default('galery_mother'),
  ),
  DB_SYNCHRONIZE: z.preprocess(
    emptyToUndefined,
    z.enum(['true', 'false']).default('false'),
  ),
  DB_SSL: z.preprocess(
    emptyToUndefined,
    z.enum(['true', 'false']).default('false'),
  ),
  DB_SSL_NO_VERIFY: z.preprocess(
    emptyToUndefined,
    z.enum(['true', 'false']).default('false'),
  ),
});

function createSslConfig(
  environment: {
    DB_SSL: 'true' | 'false';
    DB_SSL_NO_VERIFY: 'true' | 'false';
  },
  databaseUrl?: string,
) {
  const shouldForceSslFromUrl =
    !!databaseUrl &&
    !databaseUrl.includes('localhost') &&
    !databaseUrl.includes('127.0.0.1');
  const sslEnabled = environment.DB_SSL === 'true' || shouldForceSslFromUrl;
  const sslNoVerify = environment.DB_SSL_NO_VERIFY === 'true';

  if (!sslEnabled) {
    return false;
  }

  return {
    rejectUnauthorized: !sslNoVerify,
  };
}

function sanitizeDatabaseUrl(databaseUrl?: string) {
  if (!databaseUrl) {
    return undefined;
  }

  const url = new URL(databaseUrl);
  url.searchParams.delete('sslmode');
  url.searchParams.delete('sslcert');
  url.searchParams.delete('sslkey');
  url.searchParams.delete('sslrootcert');

  return url.toString();
}

export function createTypeOrmOptions(
  configService?: ConfigService,
): TypeOrmModuleOptions & DataSourceOptions {
  const environment = configService
    ? validateEnv(process.env)
    : databaseEnvSchema.parse(process.env);
  const databaseUrl = sanitizeDatabaseUrl(
    configService?.get<string>('DATABASE_URL') ?? environment.DATABASE_URL,
  );
  const ssl = createSslConfig(environment, databaseUrl);

  return {
    type: 'postgres',
    ...(databaseUrl
      ? { url: databaseUrl }
      : {
          host: configService?.get<string>('DB_HOST') ?? environment.DB_HOST,
          port: configService?.get<number>('DB_PORT') ?? environment.DB_PORT,
          username:
            configService?.get<string>('DB_USERNAME') ??
            environment.DB_USERNAME,
          password:
            configService?.get<string>('DB_PASSWORD') ??
            environment.DB_PASSWORD,
          database:
            configService?.get<string>('DB_DATABASE') ??
            environment.DB_DATABASE,
        }),
    ssl,
    extra: ssl
      ? {
          ssl,
        }
      : undefined,
    entities: ENTITIES,
    migrations: [InitialSchema1763424000000],
    synchronize:
      (configService?.get<string>('DB_SYNCHRONIZE') ??
        environment.DB_SYNCHRONIZE) === 'true',
  };
}
