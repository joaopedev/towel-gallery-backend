import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { validateEnv } from '../config/env.schema';
import { ENTITIES } from './entities';
import { InitialSchema1763424000000 } from './migrations/1763424000000-InitialSchema';

function createSslConfig(environment: {
  DB_SSL: 'true' | 'false';
  DB_SSL_NO_VERIFY: 'true' | 'false';
}) {
  const sslEnabled = environment.DB_SSL === 'true';
  const sslNoVerify = environment.DB_SSL_NO_VERIFY === 'true';

  if (!sslEnabled) {
    return false;
  }

  return {
    rejectUnauthorized: !sslNoVerify,
  };
}

export function createTypeOrmOptions(
  configService?: ConfigService,
): TypeOrmModuleOptions & DataSourceOptions {
  const environment = validateEnv(process.env);
  const databaseUrl =
    configService?.get<string>('DATABASE_URL') ?? environment.DATABASE_URL;

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
    ssl: createSslConfig(environment),
    entities: ENTITIES,
    migrations: [InitialSchema1763424000000],
    synchronize:
      (configService?.get<string>('DB_SYNCHRONIZE') ??
        environment.DB_SYNCHRONIZE) === 'true',
  };
}
