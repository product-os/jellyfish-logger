/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import intercept = require('intercept-stdout');
import { getLogger } from '../lib/index';

const TEST_CONTEXT = {
	id: 1,
};

function ansiRegex({ onlyFirst = false } = {}) {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

function stripAnsi(output: string): string {
	return output.replace(ansiRegex(), '');
}

test('getLogger() returns a logger instance', () => {
	const instance = getLogger(__filename);
	expect(instance).toBeTruthy();
});

describe('Logger', () => {
	test('.debug() should log a message', () => {
		const instance = getLogger(__filename);

		let stdoutBuf = '';
		const unhook = intercept((out) => {
			stdoutBuf += out;
		});

		const message = 'test debug';
		const packet = {
			foo: 'bar',
		};

		instance.debug(TEST_CONTEXT, message, packet);

		unhook();

		const output = stripAnsi(stdoutBuf);

		expect(output.includes('[debug]')).toBe(true);
		expect(output.includes(message)).toBe(true);
		expect(output.includes(JSON.stringify(packet))).toBe(true);
	});

	test('.debug() should not log a message if the log level is higher than "debug"', () => {
		const instance = getLogger(__filename, 'info');
		let stdoutBuf = '';
		const unhook = intercept((out) => {
			stdoutBuf += out;
		});
		const message = 'test debug';
		const packet = {
			foo: 'bar',
		};
		instance.debug(TEST_CONTEXT, message, packet);
		unhook();
		const output = stripAnsi(stdoutBuf);
		expect(output).toBe('');
	});

	test('.error() should log a message', () => {
		const instance = getLogger(__filename, 'crit');

		let stdoutBuf = '';
		const unhook = intercept((out) => {
			stdoutBuf += out;
		});

		const message = 'test error';
		const packet = {
			foo: 'bar',
		};

		instance.error(TEST_CONTEXT, message, packet);

		unhook();

		const output = stripAnsi(stdoutBuf);

		expect(output.includes('[crit]')).toBe(true);
		expect(output.includes(message)).toBe(true);
		expect(output.includes(JSON.stringify(packet))).toBe(true);
	});

	test('.error() should not log a message if the log level is higher than "crit"', () => {
		const instance = getLogger(__filename, 'alert');
		let stdoutBuf = '';
		const unhook = intercept((out) => {
			stdoutBuf += out;
		});
		const message = 'test debug';
		const packet = {
			foo: 'bar',
		};
		instance.error(TEST_CONTEXT, message, packet);
		unhook();
		const output = stripAnsi(stdoutBuf);
		expect(output).toBe('');
	});

	test('.warn() should log a message', () => {
		const instance = getLogger(__filename, 'warning');

		let stdoutBuf = '';
		const unhook = intercept((out) => {
			stdoutBuf += out;
		});

		const message = 'test warning';
		const packet = {
			foo: 'bar',
		};

		instance.warn(TEST_CONTEXT, message, packet);

		unhook();

		const output = stripAnsi(stdoutBuf);

		expect(output.includes('[warning]')).toBe(true);
		expect(output.includes(message)).toBe(true);
		expect(output.includes(JSON.stringify(packet))).toBe(true);
	});

	test('.warn() should not log a message if the log level is higher than "warning"', () => {
		const instance = getLogger(__filename, 'alert');
		let stdoutBuf = '';
		const unhook = intercept((out) => {
			stdoutBuf += out;
		});
		const message = 'test debug';
		const packet = {
			foo: 'bar',
		};
		instance.warn(TEST_CONTEXT, message, packet);
		unhook();
		const output = stripAnsi(stdoutBuf);
		expect(output).toBe('');
	});

	test('.info() should log a message', () => {
		const instance = getLogger(__filename, 'info');

		let stdoutBuf = '';
		const unhook = intercept((out) => {
			stdoutBuf += out;
		});

		const message = 'test info';
		const packet = {
			foo: 'bar',
		};

		instance.info(TEST_CONTEXT, message, packet);

		unhook();

		const output = stripAnsi(stdoutBuf);

		expect(output.includes('[info]')).toBe(true);
		expect(output.includes(message)).toBe(true);
		expect(output.includes(JSON.stringify(packet))).toBe(true);
	});

	test('.info() should not log a message if the log level is higher than "info"', () => {
		const instance = getLogger(__filename, 'notice');
		let stdoutBuf = '';
		const unhook = intercept((out) => {
			stdoutBuf += out;
		});
		const message = 'test info';
		const packet = {
			foo: 'bar',
		};
		instance.info(TEST_CONTEXT, message, packet);
		unhook();
		const output = stripAnsi(stdoutBuf);
		expect(output).toBe('');
	});
});
