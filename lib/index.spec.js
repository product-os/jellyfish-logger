/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const ava = require('ava')
const intercept = require('intercept-stdout')
const stripAnsi = require('strip-ansi')
const logger = require('./index')

const TEST_CONTEXT = {
	id: 1
}

ava('.getLogger() returns a logger instance', async (test) => {
	const instance = logger.getLogger(__filename)
	test.truthy(instance)
})

ava('Logger.debug() should log a message', async (test) => {
	const instance = logger.getLogger(__filename)

	let stdoutBuf = ''
	const unhook = intercept((out) => {
		stdoutBuf += out
	})

	const message = 'test debug'
	const packet = {
		foo: 'bar'
	}

	instance.debug(TEST_CONTEXT, message, packet)

	unhook()

	const output = stripAnsi(stdoutBuf)

	test.true(output.includes('[debug]'))
	test.true(output.includes(message))
	test.true(output.includes(JSON.stringify(packet)))
})

ava('Logger.debug() should not log a message if the log level is higher than "debug"', async (test) => {
	const instance = logger.getLogger(__filename, 'info')
	let stdoutBuf = ''
	const unhook = intercept((out) => {
		stdoutBuf += out
	})
	const message = 'test debug'
	const packet = {
		foo: 'bar'
	}
	instance.debug(TEST_CONTEXT, message, packet)
	unhook()
	const output = stripAnsi(stdoutBuf)
	test.is(output, '')
})

ava('Logger.error() should log a message', async (test) => {
	const instance = logger.getLogger(__filename, 'crit')

	let stdoutBuf = ''
	const unhook = intercept((out) => {
		stdoutBuf += out
	})

	const message = 'test error'
	const packet = {
		foo: 'bar'
	}

	instance.error(TEST_CONTEXT, message, packet)

	unhook()

	const output = stripAnsi(stdoutBuf)

	test.true(output.includes('[crit]'))
	test.true(output.includes(message))
	test.true(output.includes(JSON.stringify(packet)))
})

ava('Logger.error() should not log a message if the log level is higher than "crit"', async (test) => {
	const instance = logger.getLogger(__filename, 'alert')
	let stdoutBuf = ''
	const unhook = intercept((out) => {
		stdoutBuf += out
	})
	const message = 'test debug'
	const packet = {
		foo: 'bar'
	}
	instance.error(TEST_CONTEXT, message, packet)
	unhook()
	const output = stripAnsi(stdoutBuf)
	test.is(output, '')
})

ava('Logger.warn() should log a message', async (test) => {
	const instance = logger.getLogger(__filename, 'warn')

	let stdoutBuf = ''
	const unhook = intercept((out) => {
		stdoutBuf += out
	})

	const message = 'test warning'
	const packet = {
		foo: 'bar'
	}

	instance.warn(TEST_CONTEXT, message, packet)

	unhook()

	const output = stripAnsi(stdoutBuf)

	test.true(output.includes('[warning]'))
	test.true(output.includes(message))
	test.true(output.includes(JSON.stringify(packet)))
})

ava('Logger.warn() should not log a message if the log level is higher than "warn"', async (test) => {
	const instance = logger.getLogger(__filename, 'alert')
	let stdoutBuf = ''
	const unhook = intercept((out) => {
		stdoutBuf += out
	})
	const message = 'test debug'
	const packet = {
		foo: 'bar'
	}
	instance.warn(TEST_CONTEXT, message, packet)
	unhook()
	const output = stripAnsi(stdoutBuf)
	test.is(output, '')
})

ava('Logger.info() should log a message', async (test) => {
	const instance = logger.getLogger(__filename, 'info')

	let stdoutBuf = ''
	const unhook = intercept((out) => {
		stdoutBuf += out
	})

	const message = 'test info'
	const packet = {
		foo: 'bar'
	}

	instance.info(TEST_CONTEXT, message, packet)

	unhook()

	const output = stripAnsi(stdoutBuf)

	test.true(output.includes('[info]'))
	test.true(output.includes(message))
	test.true(output.includes(JSON.stringify(packet)))
})

ava('Logger.info() should not log a message if the log level is higher than "info"', async (test) => {
	const instance = logger.getLogger(__filename, 'notice')
	let stdoutBuf = ''
	const unhook = intercept((out) => {
		stdoutBuf += out
	})
	const message = 'test info'
	const packet = {
		foo: 'bar'
	}
	instance.info(TEST_CONTEXT, message, packet)
	unhook()
	const output = stripAnsi(stdoutBuf)
	test.is(output, '')
})
