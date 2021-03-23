/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import Sentry from '@sentry/node';
import { defaultEnvironment } from '@balena/jellyfish-environment';
import { AssertError } from '@balena/jellyfish-assert/build/types';
// tslint:disable-next-line: no-var-requires
const { version } = require('../package.json');

class Reporter {
	initialized: boolean = false;
	install: boolean = true;

	constructor() {
		this.reportException = this.reportException.bind(this);
	}

	reportException(context: object | null, error: AssertError): void {
		if (error.expected) {
			return;
		}

		if (!this.initialized) {
			if (!this.install) {
				return;
			}

			if (defaultEnvironment.sentry.server.dsn) {
				Sentry.init({
					dsn: defaultEnvironment.sentry.server.dsn,
					environment: 'server',
					release: version,
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
}

export const errorReporter = new Reporter();
