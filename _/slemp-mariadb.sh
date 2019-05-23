#!/bin/bash

# Setting
centos='6'
php_version='54'

###################
# disable selinux #
###################
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

startTime=`date +%s`

##############################
# disable un-needed services #
##############################
systemctl stop httpd
systemctl disable httpd
systemctl stop xinetd
chkcsystemctl disableonfig xinetd
systemctl stop saslauthd
systemctl disable saslauthd
systemctl stop sendmail
systemctl disable sendmail Php
systemctl stop rsyslog
systemctl disable rsyslog

# add www user
groupadd www
useradd -s /sbin/nologin -g www www

#Create directories
mkdir -pv /www/{wwwroot/default,wwwlogs,server/{panel,mysql/{bin,lib},nginx/{sbin,logs,conf/{vhost,rewrite}},php/${php_version}/{etc,bin,sbin,var/run}}}

#remove all current PHP, MySQL, mailservers, rsyslog.
yum -y remove httpd php mysql rsyslog sendmail postfix mysql-libs

###################
# Add a few repos #
###################

# epel-release repo
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-${centos}.noarch.rpm -y

# remi php repo
yum install http://rpms.remirepo.net/enterprise/remi-release-${centos}.rpm -y

# nginx repo
cat > /etc/yum.repos.d/nginx.repo <<END
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/${centos}/\$basearch/
gpgcheck=0
enabled=1
END

# mariadb repo
cat > /etc/yum.repos.d/mariadb.repo <<END
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.3/centos${centos}-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
END

################################
# Install PHP, NGINX and MySQL #
################################

yum -y install nginx

yum -y install MariaDB-server MariaDB-client

yum -y install php${php_version}-php-common php${php_version}-php-fpm php${php_version}-php-process php${php_version}-php-mysql php${php_version}-php-pecl-memcache php${php_version}-php-pecl-memcached php${php_version}-php-gd php${php_version}-php-mbstring php${php_version}-php-mcrypt php${php_version}-php-xml php${php_version}-php-pecl-apc php${php_version}-php-cli php${php_version}-php-pear php${php_version}-php-pdo

#####################################################
# Install Postfix, SyLog-Ng, Cronie and Other Stuff #
#####################################################

yum -y install postfix syslog-ng cronie wget libdbi libdbi-drivers libdbi-dbd-mysql syslog-ng-libdbi zip unzip glibc.i686

cat > /etc/init.d/panel <<END
#!/bin/bash
# chkconfig: 2345 55 25
# description: Panel Service

### BEGIN INIT INFO
# Provides:          panel
# Required-Start:    \$all
# Required-Stop:     \$all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts panel
# Description:       starts the Panel
### END INIT INFO

case "\$1" in
        'start')
                /www/server/cloud/cloud start
                ;;
        'stop')
                /www/server/cloud/cloud stop
                ;;
        'restart')
                /www/server/cloud/cloud restart
                ;;
esac
END

chmod 755 /etc/init.d/panel
chkconfig --add panel
chkconfig --level 2345 panel on

###################
# Configure nginx #
###################

cat > /www/server/nginx/conf/enable-php-${php_version}.conf <<END
location ~ [^/]\.php(/|$)
{
    try_files \$uri =404;
    fastcgi_pass  unix:/tmp/php-cgi-${php_version}.sock;
    fastcgi_index index.php;
    include /etc/nginx/fastcgi_params;
    include pathinfo.conf;
}
END

cat > /www/server/nginx/conf/pathinfo.conf <<END
set \$real_script_name \$fastcgi_script_name;
if (\$fastcgi_script_name ~ "^(.+?\.php)(/.+)$") {
set \$real_script_name \$1;
set \$path_info \$2;
}
fastcgi_param SCRIPT_FILENAME \$document_root\$real_script_name;
fastcgi_param SCRIPT_NAME \$real_script_name;
fastcgi_param PATH_INFO \$path_info;
END

cat > /etc/nginx/nginx.conf <<END
user  www www;
worker_processes auto;
error_log  /www/wwwlogs/nginx_error.log  crit;
pid        /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;

events
    {
        use epoll;
        worker_connections 51200;
        multi_accept on;
    }

http
    {
        include       mime.types;
        default_type  application/octet-stream;

        server_names_hash_bucket_size 512;
        client_header_buffer_size 32k;
        large_client_header_buffers 4 32k;
        client_max_body_size 50m;

        sendfile   on;
        tcp_nopush on;

        keepalive_timeout 60;

        tcp_nodelay on;

        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 64k;
        fastcgi_buffers 4 64k;
        fastcgi_busy_buffers_size 128k;
        fastcgi_temp_file_write_size 256k;
		    fastcgi_intercept_errors on;

        gzip on;
        gzip_min_length  1k;
        gzip_buffers     4 16k;
        gzip_http_version 1.1;
        gzip_comp_level 2;
        gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
        gzip_vary on;
        gzip_proxied   expired no-cache no-store private auth;
        gzip_disable   "MSIE [1-6]\.";

        server_tokens off;
        access_log off;
    server{
        listen 888;
        server_name basoro.id;
        index index.html index.htm index.php;
        root  /www/server/panel;

        #error_page   404   /404.html;
        include enable-php-${php_version}.conf;
        access_log  /www/wwwlogs/access.log;
    }
    server {
        listen 80 default;
        server_name _;
        index index.html index.htm index.php;
        root /www/wwwroot/default;
        include enable-php-${php_version}.conf;
    }
    include /www/server/nginx/conf/vhost/*.conf;
}
END

rm -rf /etc/nginx/conf.d/*

#install php-fpm config
cat > /opt/remi/php${php_version}/root/etc/php-fpm.d/www.conf <<END
[www]
listen = /tmp/php-cgi-${php_version}.sock
listen.allowed_clients = 127.0.0.1
listen.owner = www
listen.group = www
listen.mode = 0666
user = www
group = www
pm = dynamic
pm.status_path = /phpfpm_status
pm.process_idle_timeout = 3s
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 10
pm.max_spare_servers = 50
pm.max_requests = 500
php_admin_value[error_log] = /var/log/php-fpm/www-error.log
php_admin_flag[log_errors] = on
php_admin_value[upload_max_filesize] = 32M
END

ln -sf /opt/remi/php${php_version}/root/etc/php.ini /etc/php.ini
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/' /etc/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 100M/' /etc/php.ini

rm -f /etc/init.d/nginx
wget -O /etc/init.d/nginx basoro.id/downloads/nginx.init -T20
chmod +x /etc/init.d/nginx
ln -sf /usr/sbin/nginx /www/server/nginx/sbin/nginx
ln -sf /etc/nginx/nginx.conf /www/server/nginx/conf/nginx.conf
ln -sf /etc/nginx/mime.types /www/server/nginx/conf/mime.types
ln -sf /etc/nginx/fastcgi_params /www/server/nginx/conf/fastcgi_params
ln -sf /www/server/nginx/conf/pathinfo.conf /etc/nginx/pathinfo.conf
ln -sf /www/server/nginx/conf/enable-php-${php_version}.conf /etc/nginx/enable-php-${php_version}.conf
ln -s /www/server/nginx/conf/rewrite /etc/nginx/rewrite
ln -s /www/server/nginx/conf/key /etc/nginx/key

command="nginx -v"
nginxv=$( ${command} 2>&1 )
nginxlocal=$(echo $nginxv | grep -o '[0-9.]*$')
echo $nginxlocal > /www/server/nginx/version.pl

#rm -f /etc/init.d/php${php_version}-php-fpm
#wget -O /etc/init.d/php-fpm-${php_version} https://basoro.id/downloads/php-fpm.init
#sed -i "s@/var/run/php-fpm-${php_version}.pid@/var/run/php-fpm/php-fpm-${php_version}.pid@g" /etc/init.d/php-fpm-${php_version}

ln -sf /opt/remi/php${php_version}/root/usr/bin/php /www/server/php/${php_version}/bin/php
ln -sf /opt/remi/php${php_version}/root/usr/bin/phpize /www/server/php/${php_version}/bin/phpize
ln -sf /opt/remi/php${php_version}/root/usr/bin/pear /www/server/php/${php_version}/bin/pear
ln -sf /opt/remi/php${php_version}/root/usr/bin/pecl /www/server/php/${php_version}/bin/pecl
ln -sf /opt/remi/php${php_version}/root/usr/sbin/php-fpm /www/server/php/${php_version}/sbin/php-fpm
ln -sf /opt/remi/php${php_version}/root/etc/php.ini /www/server/php/${php_version}/etc/php.ini
ln -sf /var/run/php-fpm/php-fpm-${php_version}.pid /www/server/php/${php_version}/var/run/php-fpm.pid
mv /etc/init.d/php${php_version}-php-fpm /etc/init.d/php-fpm-${php_version}
chmod +x /etc/init.d/php-fpm-${php_version}

#################
# Install cloud #
#################

wget -c basoro.id/downloads/cloud.zip -T20
unzip -o cloud.zip -d /www/server/ > /dev/null 2>&1
chmod +x /www/server/cloud/yunclient
chmod +x /www/server/cloud/cloud
mv -f /www/server/cloud/sock.so /lib/sock.so
mv -f /www/server/cloud/spec.so /lib/spec.so
mv -f /www/server/cloud/krnln.so /lib/krnln.so
mv -f /www/server/cloud/iconv.so /lib/iconv.so
mv -f /www/server/cloud/dp1.so /lib/dp1.so
mv -f /www/server/cloud/EThread.so /lib/EThread.so
#sed -i "s@-f '/etc/init.d/mysqld'@! -f '/etc/init.d/mysqld'@g" /www/server/cloud/cloud
rm -f cloud.zip

#################
# Install Panel #
#################

yum -y install svn

svn export --force https://github.com/basoro/basoro.github.io/trunk/_/slemp-khanza/
rm -rf /www/server/panel/*
cp -a slemp-khanza/* /www/server/panel/
chown -R www:www /www/server/panel > /dev/null 2>&1
rm -rf slemp-khanza/
wget -O phpMyAdmin.zip basoro.id/downloads/phpMyAdmin-4.4.15.6.zip -T20
unzip -o phpMyAdmin.zip -d /www/server/panel/ > /dev/null 2>&1
rm -f phpMyAdmin.zip
dates=`date`
pwd=`echo -n $dates|md5sum|cut -d ' ' -f1`
dpwd=${pwd:0:12}
sed -i "s@MYPWD@${dpwd}@" /www/server/panel/conf/sql.config.php
sed -i "s#\$cfg['blowfish_secret'] = ''#\$cfg['blowfish_secret'] = 'ataaka'#" /www/server/panel/databaseAdmin/config.sample.inc.php
phpmyadminExt=${pwd:10:10}
mv /www/server/panel/databaseAdmin /www/server/panel/phpmyadmin_$phpmyadminExt
chown -R www.www /www/server/panel/phpmyadmin_$phpmyadminExt
echo "phpmyadmin_${phpmyadminExt}" > /www/server/cloud/phpmyadminDirName.pl

mypwd=${pwd:0:16}
mysqlpwd=$mypwd
echo "${mysqlpwd}" > /www/server/mysql/default.pl

## Ini belum fix
ln -sf /usr/bin/mysql /www/server/mysql/bin/mysql
ln -sf /usr/bin/mysqldump /www/server/mysql/bin/mysqldump
ln -sf /usr/bin/myisamchk /www/server/mysql/bin/myisamchk
ln -sf /usr/bin/mysqld_safe /www/server/mysql/bin/mysqld_safe
ln -sf /usr/bin/mysqlcheck /www/server/mysql/bin/mysqlcheck
ln -s /usr/lib64/libmysqlclient.so.18 /www/server/mysql/lib/libmysqlclient.so
ln -s /usr/lib64/libmysqlclient.so.18 /www/server/mysql/lib/libmysqlclient.so.18
ln -sf /var/lib/mysql/mysql.sock /tmp/mysql.sock
echo "10.3.15" > /www/server/mysql/version.pl
service mysql start
sleep 5
ln -s /var/lib/mysql /www/server/data

####################
# Install Panel DB #
####################

/usr/bin/mysqladmin -u root password 'root'
/www/server/mysql/bin/mysql -uroot -proot -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('${mysqlpwd}')"
/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "SET PASSWORD FOR 'root'@'127.0.0.1' = PASSWORD('${mysqlpwd}')"
/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "flush privileges"
/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "create database bt_default"
/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "grant select,insert,update,delete,create,drop,alter on bt_default .* to bt_default@localhost identified by '${dpwd}'"
/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "flush privileges"
/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} bt_default < /www/server/panel/database.sql
/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "update bt_default.bt_config set webserver='nginx' where id=1"
rm -f /www/server/panel/database.sql

token=${pwd:0:8}
echo "${token}" > /www/server/token.pl
userINI='/www/server/panel/.user.ini'
if [ -f "${userINI}" ];then
  chattr -i $userINI
  rm -f $userINI
fi

###########################
# start services firewall #
###########################

if [ -f "/etc/init.d/iptables" ];then
  iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
  iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT
  iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 888 -j ACCEPT
  iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT
  service iptables save

  iptables_status=`service iptables status | grep 'not running'`
  if [ "${iptables_status}" == '' ];then
    service iptables restart
  fi
fi

if [ ! -f "/etc/init.d/iptables" ];then
  yum install firewalld -y
  systemctl enable firewalld
  systemctl start firewalld
  firewall-cmd --permanent --zone=public --add-port=22/tcp
  firewall-cmd --permanent --zone=public --add-port=80/tcp
  firewall-cmd --permanent --zone=public --add-port=888/tcp
  firewall-cmd --permanent --zone=public --add-port=3306/tcp
  firewall-cmd --reload
fi


chkconfig syslog-ng on
service syslog-ng start
chkconfig crond on
service crond start
service nginx restart
chkconfig nginx on
service php-fpm-${php_version} start
chkconfig php-fpm-${php_version} on
service mysql restart
chkconfig mysql on
service panel start

chown -R www:www /www/wwwroot/default/
chown -R www:www /www/server/panel/

#Fix Sessions:
#mkdir /var/lib/php/session
#chmod 777 /var/lib/php/session

sleep 3

cd ~

clear
echo
echo
echo "====================================="
echo -e "\033[32mInstalasi server selesai.\033[0m"
echo -e "====================================="
echo Default Site Url: http://SERVER_IP:888
echo MySQL Password: $mysqlpwd
echo phpMyAdmin: http://SERVER_IP:888/phpmyadmin_$phpmyadminExt
echo -e "====================================="
mv -f install.sh /www/server/install.sh
endTime=`date +%s`
((outTime=($endTime-$startTime)/60))
echo -e "Time consuming:\033[32m $outTime \033[0mMinute!"
echo
echo
echo
exit
