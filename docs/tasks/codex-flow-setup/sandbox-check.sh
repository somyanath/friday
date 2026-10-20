#!/bin/sh
cd "$(dirname "$0")"
echo "== 1. start server on 127.0.0.1:4310"
python3 -m http.server 4310 --bind 127.0.0.1 > server.log 2>&1 &
PID=$!
sleep 2
if kill -0 $PID 2>/dev/null; then echo "server running (pid $PID)"; else echo "server exited:"; cat server.log; fi
echo "== 2. curl loopback"
curl -sS -o /dev/null -w 'http=%{http_code}\n' http://127.0.0.1:4310/page.html; echo "curl exit=$?"
echo "== 3. headless Chrome against the server"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --user-data-dir="$PWD/chrome-profile" --window-size=1440,900 \
  --screenshot="$PWD/sandbox-shot.png" http://127.0.0.1:4310/page.html 2>&1 | grep -v -i 'allocator' | tail -3
echo "chrome exit=$?"; ls -la sandbox-shot.png 2>&1
echo "== 4. stop server"
kill $PID 2>/dev/null; echo "done"
