/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	// NOTE: Because the unit tests in this module rely on capturing stdout, 
	// jest has to be run in "verbose" mode for the correct output to appear, otherwise
	// jest will swallow the log messages and the tests will fail
	verbose: true
};
