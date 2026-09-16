#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <path/to/file.cc>"
    exit 1
fi

FILE="$1"
export PATH="/code/BrowserX/depot_tools:$PATH"

cd /code/BrowserX/chromium/src
echo "Finding GN target for '$FILE'..."
# gn refs will list targets depending on this file.
TARGET=$(gn refs out/SlaveDev "//$FILE" | head -n 1)

if [ -z "$TARGET" ]; then
    echo "No targets found for $FILE"
    exit 1
fi

echo "Building target: $TARGET"
autoninja -C out/SlaveDev "$TARGET"
