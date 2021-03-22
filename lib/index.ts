/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import typedErrors from 'typed-errors';
import errio from 'errio';
import path from 'path';
import _ from 'lodash';
import winston from 'winston';
import { errorReporter } from './error-reporter';
import environment from '@balena/jellyfish-environment';
import { INTERNAL } from '@balena/jellyfish-assert';

type LogContext = object | null;

const BASE_PATH = path.join(__dirname, '..', '..', '..');

// Adds winston.transports.Insight
// tslint:disable-next-line: no-var-requires
require('r7insight_node');

const LoggerNoContext = typedErrors.makeTypedError('LoggerNoContext');

// See https://github.com/winstonjs/winston#logging-levels for more information
// about log levels. TLDR; the higher the log priority the lower the
// corresponding integer
const LEVELS = winston.config.syslog.levels;

type LEVEL =
	| 'emerg'
	| 'alert'
	| 'crit'
	| 'error'
	| 'warning'
	| 'notice'
	| 'info'
	| 'debug';

class Logger {
	level: LEVEL;
	namespace: string;
	logger: winston.Logger;

	constructor(level: LEVEL, filename: string, transport: winston.transport) {
		this.level = level;

		const moduleName = path
			.relative(BASE_PATH, filename)
			.split(path.sep)
			.slice(1)
			.join(path.sep);

		this.namespace = path.join(
			path.dirname(moduleName),
			path.basename(moduleName, path.extname(moduleName)),
		);

		this.logger = winston.createLogger({
			levels: winston.config.syslog.levels,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
			),
			transports: [transport],
			exceptionHandlers: [transport],
			exitOnError: false,
			level,
		});
	}

	debug(context: LogContext, message: string, data?: object): void {
		if (LEVELS[this.level] < LEVELS.debug) {
			return;
		}

		this.logger.log('debug', message, {
			namespace: this.namespace,
			context,
			data,
		});
	}

	error(context: LogContext, message: string, data?: object): void {
		if (LEVELS[this.level] < LEVELS.crit) {
			return;
		}

		this.logger.log('crit', message, {
			namespace: this.namespace,
			context,
			data,
		});
	}

	warn(context: LogContext, message: string, data?: object): void {
		if (LEVELS[this.level] < LEVELS.warning) {
			return;
		}

		this.logger.log('warning', message, {
			namespace: this.namespace,
			context,
			data,
		});
	}

	info(context: LogContext, message: string, data?: object) {
		if (LEVELS[this.level] < LEVELS.info) {
			return;
		}

		this.logger.log('info', message, {
			namespace: this.namespace,
			context,
			data,
		});
	}

	exception(context: LogContext, message: string, error: Error) {
		INTERNAL(context, _.isError(error), Error, () => {
			return [
				'Last argument to .exception() should be an error:',
				JSON.stringify(error, null, 2),
			].join(' ');
		});

		const errorObject = errio.toObject(error, {
			stack: true,
		});

		this.error(context, message, errorObject);
		errorReporter.reportException(context, error);
	}
}

// TODO: Replace references to "logentries" to "insight".
const newTransport = (): winston.transport => {
	if (environment.isProduction() && environment.logentries.token) {
		// winston.transports.Insight is populated by requiring 'r7insight_node'. But
		// TypeScript does not know about it! There is also no TypeScript definition
		// for this transport class in the r7insight_node package.
		const InsightTransport = _.get(winston.transports, ['Insight']);
		return new InsightTransport({
			token: environment.logentries.token,
			region: environment.logentries.region,
		});
	}

	const consoleTransport = new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.printf((info) => {
				INTERNAL(null, info.context && info.context.id, LoggerNoContext, () => {
					return `Missing context: ${JSON.stringify(info)}`;
				});

				const id = info.context.id;
				const prefix = `${info.timestamp} [${info.namespace}] [${info.level}] [${id}]:`;
				if (info.data) {
					return `${prefix} ${info.message} ${JSON.stringify(info.data)}`;
				}

				return `${prefix} ${info.message}`;
			}),
		),
	});

	// The console transport only allows 30 max listeners by default, which is too
	// low for Jellyfish and causes a lot of console warnings to be generated
	// (though creating no functional difference)
	consoleTransport.setMaxListeners(Infinity);

	return consoleTransport;
};

const theTransport = newTransport();
const defaultLogLevel = (environment.logger.loglevel as LEVEL) || 'debug';

export const getLogger = _.memoize(
	(filename: string, logLevel: LEVEL = defaultLogLevel) => {
		return new Logger(logLevel, filename, theTransport);
	},
	(filename, level) => {
		return level ? `${level}:${filename}` : `${defaultLogLevel}:${filename}`;
	},
);
