# Jellyfish Logger

The Jellyfish backend strongly discourages the use of `console.log()`. This
module provides a set of functions that the backend uses for logging purposes.

## Goals

- The logger takes a request ID parameter to easily filter down logs that correspond to a single system request
- The logger is able to log uncaught exceptions
- The logger is able to send logs using different priority levels
- The logger is able to preserve rich object logs
- The logger is able to pipe logs to a central location when running in production

# Usage

Below is an example how to use this library:

```js
const logger = require('@balena/jellyfish-logger')

logger.warn(context, 'Inserting card', {
    slug: card.slug,
    type: card.type
})
```

# Documentation

[![Publish Documentation](https://github.com/product-os/jellyfish-logger/actions/workflows/publish-docs.yml/badge.svg)](https://github.com/product-os/jellyfish-logger/actions/workflows/publish-docs.yml)

Visit the website for complete documentation: https://product-os.github.io/jellyfish-logger

