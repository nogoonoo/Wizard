#!/bin/bash

#write content to tmp files
#then do this stuff below

#get config file and make temp copy
source_file=$4
date=$(date +"%s")
extension="${source_file##*.}"
new_filename="${source_file%.*}_${date}.${extension}"
#cp $source_file $new_filename

#this takes everthing between 1 and 2, replaces it with the contents of 3 and writes to 4
updateConfig () {
  #perl -i -p0e 's/cal_ics_start.*?cal_ics_end",\n/`cat ics.txt`/se' /Users/XXX/Desktop/config.js
  perl -i -p0e 's/'$1'.*'$2'/`cat '$3'`/se' $4
}

#updateConfig "\/\/$1" "\/\/$2" "temp\/$3"
#updateConfig "\/\/cal_name_start" "\/\/cal_name_end" "temp\/calname.txt"
echo "\/\/$1" "\/\/$2" "temp\/$3" "$4"
updateConfig "\/\/$1" "\/\/$2" "temp\/$3" "$4"
echo "complete";
