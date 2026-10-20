#!/bin/sh
cd "$(dirname "$0")"
python3 -m http.server 4310 --bind 127.0.0.1 > server.log 2>&1 &
PID=$!; sleep 2
curl -sS -o /dev/null -w 'curl http=%{http_code}\n' http://127.0.0.1:4310/page.html
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for MODE in default nosandbox; do
  EXTRA=""; [ "$MODE" = nosandbox ] && EXTRA="--no-sandbox"
  "$C" --headless=new --disable-gpu --hide-scrollbars $EXTRA \
    --user-data-dir="$PWD/chrome-profile-$MODE" --window-size=1440,900 \
    --screenshot="$PWD/shot-$MODE.png" http://127.0.0.1:4310/page.html > chrome-$MODE.log 2>&1 &
  CPID=$!
  i=0; while kill -0 $CPID 2>/dev/null && [ $i -lt 45 ]; do sleep 1; i=$((i+1)); done
  if kill -0 $CPID 2>/dev/null; then kill $CPID; echo "chrome $MODE: killed after 45s"; else wait $CPID; echo "chrome $MODE exit=$?"; fi
  ls shot-$MODE.png 2>&1
  grep -i -E 'error|denied|not permitted|fatal|sandbox' chrome-$MODE.log | grep -v allocator | head -5
done
kill $PID
