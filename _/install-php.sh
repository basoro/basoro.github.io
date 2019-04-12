#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
echo "
+----------------------------------------------------------------------
| SLEMP Khanza Panel 1.0 Beta FOR CentOS
+----------------------------------------------------------------------
| Install multiple PHP
| Thanks to Lnmp.org
+----------------------------------------------------------------------
"
startTime=`date +%s`

yum -y install git gcc gcc-c++ libxml2-devel pkgconfig openssl-devel bzip2-devel curl-devel libpng-devel libjpeg-devel libXpm-devel freetype-devel gmp-devel libmcrypt-devel mysql-devel aspell-devel recode-devel autoconf bison re2c libicu-devel

php_path="/www/server/php"
php_setup_path="/www/server/php"
run_path="/root"
vphp='7.1.2'

cd ${run_path}
php_version="71"
php_setup_path=${php_path}/${php_version}

mkdir -p ${php_setup_path}
rm -rf ${php_setup_path}/*
cd ${php_setup_path}
wget -O ${php_setup_path}/src.tar.gz http://id1.php.net/distributions/php-${vphp}.tar.gz -T20

tar zxf src.tar.gz
mv php-${vphp} src
cd src
./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --with-mcrypt --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-soap --with-gettext --disable-fileinfo --enable-opcache
  make
  make install

if [ ! -f "${php_setup_path}/bin/php" ];then
  echo '========================================================'
  echo -e "\033[31mERROR: php-fpm installation failed.\033[0m";
  rm -rf ${php_setup_path}
  exit 0;
fi

ln -sf ${php_setup_path}/bin/php /usr/bin/php
ln -sf ${php_setup_path}/bin/phpize /usr/bin/phpize
ln -sf ${php_setup_path}/bin/pear /usr/bin/pear
ln -sf ${php_setup_path}/bin/pecl /usr/bin/pecl
ln -sf ${php_setup_path}/sbin/php-fpm /usr/bin/php-fpm

echo "Copy new php configure file..."
mkdir -p ${php_setup_path}/etc
\cp php.ini-production ${php_setup_path}/etc/php.ini

cd ${php_setup_path}

echo "Modify php.ini......"
sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
sed -i 's/short_open_tag =.*/short_open_tag = On/g' ${php_setup_path}/etc/php.ini
sed -i 's/;cgi.fix_pathinfo=.*/cgi.fix_pathinfo=0/g' ${php_setup_path}/etc/php.ini
sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
pear config-set php_ini ${php_setup_path}/etc/php.ini
pecl config-set php_ini ${php_setup_path}/etc/php.ini

echo "Install ZendGuardLoader for PHP 7..."
echo "unavailable now."

echo "Write ZendGuardLoader to php.ini..."
cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

;opcache

[Zend ZendGuard Loader]
;php7 do not support zendguardloader @Sep.2015,after support you can uncomment the following line.
;zend_extension=/usr/local/zend/php71/ZendGuardLoader.so
;zend_loader.enable=1
;zend_loader.disable_licensing=0
;zend_loader.obfuscation_level_support=3
;zend_loader.license_path=

;xcache

EOF

cat >${php_setup_path}/etc/php-fpm.conf<<EOF
[global]
pid = ${php_setup_path}/var/run/php-fpm.pid
error_log = ${php_setup_path}/var/log/php-fpm.log
log_level = notice

[www]
listen = /tmp/php-cgi-71.sock
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
listen.owner = www
listen.group = www
listen.mode = 0666
user = www
group = www
pm = dynamic
pm.status_path = /phpfpm_71_status
pm.max_children = 20
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 6
request_terminate_timeout = 100
request_slowlog_timeout = 30
slowlog = var/log/slow.log
EOF
\cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-71
chmod +x /etc/init.d/php-fpm-71

chkconfig --add php-fpm-71
chkconfig --level 2345 php-fpm-71 off
service php-fpm-71 start
wget -O /www/server/nginx/conf/enable-php-71.conf https://basoro.id/downloads/enable-php-71.conf -T20
rm -f ${php_setup_path}/src.tar.gz

sleep 3

cd ~

clear
echo
echo
echo "====================================="
echo -e "\033[32mInstalasi Multi PHP-FPM selesai.\033[0m"
echo -e "====================================="
mv -f install.sh /www/server/install.sh
endTime=`date +%s`
((outTime=($endTime-$startTime)/60))
echo -e "Time consuming:\033[32m $outTime \033[0mMinute!"
echo
echo
echo
exit
