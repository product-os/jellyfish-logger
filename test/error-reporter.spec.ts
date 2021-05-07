/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { getErrorReporter } from '../lib/error-reporter';
import sentryTestkit = require('sentry-testkit');

const DUMMY_DSN = 'http://dummy@sentry.io/000001';
const TEST_CONTEXT = {
	id: 1,
};

describe('errorReporter', () => {
	test('should report an exception', async () => {
		const { testkit, sentryTransport } = sentryTestkit();

		const errorReporter = getErrorReporter({
			dsn: DUMMY_DSN,
			transport: sentryTransport,
		});

		const message = 'foobar';

		errorReporter.reportException(TEST_CONTEXT, new Error(message));
		await errorReporter.flush();

		expect(testkit.reports()).toHaveLength(1);
		const report = testkit.reports()[0];
		expect(report.error?.message).toBe(message);
	});
});
