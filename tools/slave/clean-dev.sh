#!/bin/bash
set -e

export PATH="/code/BrowserX/depot_tools:$PATH"

cd /code/BrowserX/chromium/src
echo "Cleaning out/SlaveDev..."
gn clean out/SlaveDev
echo "Clean complete."
