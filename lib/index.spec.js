/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const ava = require('ava')
const _ = require('lodash')
const logger = require('./index')

ava('.getLogger() returns a logger instance', async (test) => {
	const instance = logger.getLogger(__filename)
	test.truthy(instance)
})
