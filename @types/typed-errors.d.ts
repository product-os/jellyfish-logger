/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

// Type definitions for errio

interface TypedError extends Error {
  new (): TypedError;
}

declare module 'typed-errors' {
  let makeTypedError: (name: string) => TypedError;
}
