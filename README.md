# plasmo-wallet

An Account Abstraction browser wallet built with the Plasmo framework.

## Start

```shell
% pnpm install
```

## DEV Mode

```shell
% PKG1="imtoken-wallet" && pnpm --filter ${PKG1} dev --target=chrome-mv3
```

## Build and ZIP

```shell
% PKG1="imtoken-wallet" && pnpm --filter ${PKG1} build --zip --target=chrome-mv3
```

## Other Command

- Update Plasmo

```shell
% PKG1="imtoken-wallet" && pnpm --filter ${PKG1} up -L plasmo
```
