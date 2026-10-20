```text
curl http=200
check2.sh: line 7: 12990 Abort trap: 6           "$C" --headless=new --disable-gpu --hide-scrollbars $EXTRA --user-data-dir="$PWD/chrome-profile-$MODE" --window-size=1440,900 --screenshot="$PWD/shot-$MODE.png" http://127.0.0.1:4310/page.html > chrome-$MODE.log 2>&1
chrome default exit=134
ls: shot-default.png: No such file or directory
check2.sh: line 7: 13003 Abort trap: 6           "$C" --headless=new --disable-gpu --hide-scrollbars $EXTRA --user-data-dir="$PWD/chrome-profile-$MODE" --window-size=1440,900 --screenshot="$PWD/shot-$MODE.png" http://127.0.0.1:4310/page.html > chrome-$MODE.log 2>&1
chrome nosandbox exit=134
ls: shot-nosandbox.png: No such file or directory
```