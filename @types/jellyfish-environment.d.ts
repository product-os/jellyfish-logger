/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

// Temporary type definitions until jellyfish-environment is converted to TypeScript

interface SentryEnvironment {
  server: {
    dsn: string
  }
}

interface LogEntries {
  token: string;
  region: string;
}

interface LoggerEnvironment {
  loglevel: string;
}

declare module '@balena/jellyfish-environment' {
  let isProduction: () => boolean;
  let sentry: SentryEnvironment;
  let logentries: LogEntries;
  let logger: LoggerEnvironment;
}
