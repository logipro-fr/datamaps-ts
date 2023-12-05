# Spark-TS

Use Spark-TS to initialize a typescript web project from scratch. This prepares a correct development environment for writing clean code.

---

# Install

```console
git clone git@gitlab.logipro.com:alban/spark-ts.git
./install
```

# Build

## Transpile

```console
bin/tsc
```

# Contributing to Spark-TS

## Requirements

-   docker
-   git

## Unit Test

Test source files with TypeScript Jest:

```console
bin/npm run test
```

## Quality

Code requirements:

-   codecheck: `eslint:recommended` & `typescript-eslint:recommended`
-   coverage >= 100%
-   infection >= 100%

Check code with ESLint:

```console
bin/npm run codecheck
```

Check format with Prettier:

```console
bin/npm run prettier
```

Check infection with Stryker Mutator:

```console
bin/npm run test:mutate
```
