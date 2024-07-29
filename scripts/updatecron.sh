#!/bin/bash 

    crontab -r 
    
    line="#power_start
    #power_on
    00 08 * * * vcgencmd display_power 1 ; pm2 restart mm
    #power_off
    00 21 * * *  vcgencmd display_power 0
    #power_end

    00 03 * * 1 /home/pi/Scripts/gs-updater.sh > /home/pi/Scripts/logs/gsCron.log 2>&1"
    
    echo "$line" | crontab -u pi -
    