import path from 'path';
import { Container } from 'typedi';
import type { TlsOptions } from 'tls';
import type { DataSourceOptions, LoggerOptions } from '@flowease/typeorm';
import type { SqliteConnectionOptions } from '@flowease/typeorm/driver/sqlite/SqliteConnectionOptions';
import type { SqlitePooledConnectionOptions } from '@flowease/typeorm/driver/sqlite-pooled/SqlitePooledConnectionOptions';
import type { PostgresConnectionOptions } from '@flowease/typeorm/driver/postgres/PostgresConnectionOptions';
import type { MysqlConnectionOptions } from '@flowease/typeorm/driver/mysql/MysqlConnectionOptions';
import { InstanceSettings } from 'flowease-core';
import { ApplicationError } from 'flowease-workflow';

import config from '@/config';
import { entities } from './entities';
import { mysqlMigrations } from './migrations/mysqldb';
import { postgresMigrations } from './migrations/postgresdb';
import { sqliteMigrations } from './migrations/sqlite';

const getCommonOptions = () => {
	const entityPrefix = config.getEnv('database.tablePrefix');
	const maxQueryExecutionTime = config.getEnv('database.logging.maxQueryExecutionTime');

	let loggingOption: LoggerOptions = config.getEnv('database.logging.enabled');
	if (loggingOption) {
		const optionsString = config.getEnv('database.logging.options').replace(/\s+/g, '');

		if (optionsString === 'all') {
			loggingOption = optionsString;
		} else {
			loggingOption = optionsString.split(',') as LoggerOptions;
		}
	}
	return {
		entityPrefix,
		entities: Object.values(entities),
		migrationsTableName: `${entityPrefix}migrations`,
		migrationsRun: false,
		synchronize: false,
		maxQueryExecutionTime,
		logging: loggingOption,
	};
};

export const getOptionOverrides = (dbType: 'postgresdb' | 'mysqldb') => ({
	database: config.getEnv(`database.${dbType}.database`),
	host: config.getEnv(`database.${dbType}.host`),
	port: config.getEnv(`database.${dbType}.port`),
	username: config.getEnv(`database.${dbType}.user`),
	password: config.getEnv(`database.${dbType}.password`),
});

const getSqliteConnectionOptions = (): SqliteConnectionOptions | SqlitePooledConnectionOptions => {
	const poolSize = config.getEnv('database.sqlite.poolSize');
	const commonOptions = {
		...getCommonOptions(),
		database: path.resolve(
			Container.get(InstanceSettings).floweaseFolder,
			config.getEnv('database.sqlite.database'),
		),
		migrations: sqliteMigrations,
	};
	if (poolSize > 0) {
		return {
			type: 'sqlite-pooled',
			poolSize,
			enableWAL: true,
			acquireTimeout: 60_000,
			destroyTimeout: 5_000,
			...commonOptions,
		};
	} else {
		return {
			type: 'sqlite',
			enableWAL: config.getEnv('database.sqlite.enableWAL'),
			...commonOptions,
		};
	}
};

const getPostgresConnectionOptions = (): PostgresConnectionOptions => {
	const sslCa = config.getEnv('database.postgresdb.ssl.ca');
	const sslCert = config.getEnv('database.postgresdb.ssl.cert');
	const sslKey = config.getEnv('database.postgresdb.ssl.key');
	const sslRejectUnauthorized = config.getEnv('database.postgresdb.ssl.rejectUnauthorized');

	let ssl: TlsOptions | boolean = config.getEnv('database.postgresdb.ssl.enabled');
	if (sslCa !== '' || sslCert !== '' || sslKey !== '' || !sslRejectUnauthorized) {
		ssl = {
			ca: sslCa || undefined,
			cert: sslCert || undefined,
			key: sslKey || undefined,
			rejectUnauthorized: sslRejectUnauthorized,
		};
	}

	return {
		type: 'postgres',
		...getCommonOptions(),
		...getOptionOverrides('postgresdb'),
		schema: config.getEnv('database.postgresdb.schema'),
		poolSize: config.getEnv('database.postgresdb.poolSize'),
		migrations: postgresMigrations,
		ssl,
	};
};

const getMysqlConnectionOptions = (dbType: 'mariadb' | 'mysqldb'): MysqlConnectionOptions => ({
	type: dbType === 'mysqldb' ? 'mysql' : 'mariadb',
	...getCommonOptions(),
	...getOptionOverrides('mysqldb'),
	migrations: mysqlMigrations,
	timezone: 'Z', // set UTC as default
});

export function getConnectionOptions(): DataSourceOptions {
	const dbType = config.getEnv('database.type');
	switch (dbType) {
		case 'sqlite':
			return getSqliteConnectionOptions();
		case 'postgresdb':
			return getPostgresConnectionOptions();
		case 'mariadb':
		case 'mysqldb':
			return getMysqlConnectionOptions(dbType);
		default:
			throw new ApplicationError('Database type currently not supported', { extra: { dbType } });
	}
}
