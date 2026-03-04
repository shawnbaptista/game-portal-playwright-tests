#!/bin/bash
set -e

corepack enable
corepack prepare yarn@4.10.3 --activate
yarn --version
yarn install --immutable
yarn playwright install --with-deps
