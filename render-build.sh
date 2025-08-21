#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm install

# Build project if needed
# npm run build

# Set Puppeteer cache directory to /tmp (safe for Render)
export PUPPETEER_CACHE_DIR=/tmp/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

# Install Chrome for Puppeteer
npx puppeteer browsers install chrome
