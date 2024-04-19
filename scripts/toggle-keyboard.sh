#!/bin/bash
#This script toggle the virtual keyboard
#
# this file is in /usr/bin/toggle-wvkbd.sh
#
PID="$(pidof wvkbd-mobintl)"
if [  "$PID" != ""  ]; then
  killall wvkbd-mobintl
else
 wvkbd-mobintl -L 300 --landscape-layers full
# use wvkbd-mobintl --help for options
# my options:
# -L 300 = landscape, 300 pixels tall
# --landscape-layers full - numbers and letters


fi
