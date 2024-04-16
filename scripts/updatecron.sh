#!/bin/bash 

crontab -r 

line="#power_start
#power_on
00 07 * * * pi vcgencmd display_power 1
#power_off
03 22 * * * pi vcgencmd display_power 0
#power_end" 
 
echo "$line" | crontab -u pi -
