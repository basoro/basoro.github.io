#!/bin/bash

cd /tmp/
svn export --force https://github.com/basoro/basoro.github.io/trunk/_/slemp-khanza/
rm -rf /tmp/slemp-khanza/conf
cp -a /tmp/slemp-khanza/* /www/server/panel/
chown -R www:www /www/server/panel > /dev/null 2>&1
rm -rf /tmp/slemp-khanza/

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
