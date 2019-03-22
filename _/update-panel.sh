#!/bin/bash

# Install Panel

cd ~
wget -c https://github.com/tiredbug/panel/archive/master.zip -T20
unzip -o master.zip -d /tmp/ > /dev/null 2>&1 
rm -rf /tmp/panel-master/conf 
cp -a /tmp/panel-master/* /www/server/panel/
chown -R www:www /www/server/panel > /dev/null 2>&1
rm -rf /tmp/panel-master/
rm -f master.zip

sleep 3

cd ~

clear
echo
echo
echo
echo
echo "====================================="
echo -e "\033[32mUpdate panel server selesai.\033[0m"
echo -e "====================================="
echo
echo
echo
exit
