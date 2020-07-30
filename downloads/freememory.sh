#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

endDate=`date +"%Y-%m-%d %H:%M:%S"`
log="Free memory!"
echo "★[$endDate] $log"
echo '----------------------------------------------------------------------------'

if [ -f "/etc/init.d/php-fpm" ];then
	/etc/init.d/php-fpm reload
fi

if [ -f "/etc/init.d/mysqld" ];then
	/etc/init.d/mysqld reload
fi

if [ -f "/etc/init.d/nginx" ];then
	/etc/init.d/nginx reload
fi

echo '----------------------------------------------------------------------------'
