import * as Sentry from '@sentry/node';
import { defaultEnvironment } from '@balena/jellyfish-environment';
import { LogContext } from './index';

// tslint:disable-next-line: no-var-requires
const { version } = require('../package.json');

class Reporter {
	initialized: boolean = false;
	install: boolean = true;
	transport?: any;
	dsn?: string;

	constructor(options: { transport?: any; dsn?: string }) {
		this.reportException = this.reportException.bind(this);
		if (options.transport) {
			this.transport = options.transport;
		}
		if (options.dsn) {
			this.dsn = options.dsn;
		}
	}

	reportException(context: LogContext, error: Error): void {
		if (!this.initialized) {
			if (!this.install) {
				return;
			}

			const dsn = this.dsn || defaultEnvironment.sentry.server.dsn;

			if (dsn) {
				Sentry.init({
					dsn,
					environment: 'server',
					release: version,
					transport: this.transport,
				});

				this.initialized = true;
			}

			this.install = false;
		}

		if (this.initialized) {
			Sentry.captureException(error, { tags: { requestId: context.id } });
		}
	}

	// Flushes the reporter, sending any outstanding events
	// @see https://docs.sentry.io/platforms/javascript/configuration/draining/
	flush() {
		return Sentry.flush();
	}
}

export const getErrorReporter = (
	options: { transport?: any; dsn?: string } = {},
) => {
	return new Reporter(options);
};
