#!/bin/bash
set -e

# Export depot_tools to PATH
export PATH="/code/BrowserX/depot_tools:$PATH"

cd /code/BrowserX/chromium/src
echo "Building 'chrome' in out/SlaveDev..."
autoninja -C out/SlaveDev chrome
