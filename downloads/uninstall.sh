#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

while [ "$go" != 'y' ] && [ "$go" != 'n' ]
	do
		echo "您真的要卸载Linux面板吗?";
		read -p "Ready You a start the uninstallation?(y/n): " go;
	done
	if [ "${go}" == 'n' ];then
		echo '您选择了取消卸载,退出!';
		echo 'Your alrea cancel the uninstall.';
		exit 1;
	fi
echo '=======================================================';

service yunclient stop
service nginx stop
service httpd stop
service mysqld stop
service pure-ftpd stop
service php-fpm-52 stop	
service php-fpm-53 stop	
service php-fpm-54 stop	
service php-fpm-55 stop	
service php-fpm-56 stop	
service php-fpm-70 stop	

chkconfig --del yunclient
chkconfig --del nginx
chkconfig --del httpd
chkconfig --del mysqld
chkconfig --del pure-ftpd
chkconfig --del php-fpm-52
chkconfig --del php-fpm-53
chkconfig --del php-fpm-54
chkconfig --del php-fpm-55
chkconfig --del php-fpm-56
chkconfig --del php-fpm-70

rm -f /etc/init.d/yunclient
rm -f /etc/init.d/nginx
rm -f /etc/init.d/httpd
rm -f /etc/init.d/mysqld
rm -f /etc/init.d/pure-ftpd
rm -f /etc/init.d/php-fpm-52
rm -f /etc/init.d/php-fpm-53
rm -f /etc/init.d/php-fpm-54
rm -f /etc/init.d/php-fpm-55
rm -f /etc/init.d/php-fpm-56
rm -f /etc/init.d/php-fpm-70
rm -f /bin/zun
rm -f /usr/bin/curl
rm -f /etc/my.cnf

rm -rf /www/server/cloud
rm -rf /www/server/nginx
rm -rf /www/server/apache
rm -rf /www/server/mysql
rm -rf /www/server/pure-ftpd
rm -rf /www/server/php
rm -rf /www/server/default.pl
rm -rf /usr/local/zend
rm -rf /usr/local/curl
rm -rf /usr/include/curl

echo '=======================================================';
echo '卸载成功!'
echo 'Uninstall successfully'
echo '=======================================================';