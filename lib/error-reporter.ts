/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import * as Sentry from '@sentry/node';
import { defaultEnvironment } from '@balena/jellyfish-environment';
import { AssertError } from '@balena/jellyfish-assert/build/types';
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

	reportException(context: object | null, error: AssertError): void {
		if (error.expected) {
			return;
		}

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
			error.context = context;
			Sentry.captureException(error);
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
