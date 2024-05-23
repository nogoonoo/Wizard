#!/bin/sh
#curl -s http://localhost:3000/setupdatemsg?showmsg=true
pm2 start mm
pm2 stop wizard-client
pm2 save
pm2 stop mm
#curl -s http://localhost:3000/setupdatemsg?showmsg=false
pm2 start wizard-client -- settings