#!/bin/bash
export PATH="/code/BrowserX/depot_tools:$PATH"

echo "=== System Status ==="
echo "CPU: $(nproc) cores"
free -h | grep -E 'Mem|Swap'
df -h /code

echo -e "\n=== Git Status (Chromium) ==="
cd /code/BrowserX/chromium/src
git log -1 --oneline
git branch --show-current

echo -e "\n=== Build Configuration (SlaveDev) ==="
if [ -f out/SlaveDev/args.gn ]; then
    cat out/SlaveDev/args.gn
else
    echo "out/SlaveDev/args.gn not found. Run gn gen out/SlaveDev first."
fi

echo -e "\n=== Build Tools ==="
gn --version 2>/dev/null || echo "gn not found"
autoninja --version 2>/dev/null || echo "autoninja not found"
