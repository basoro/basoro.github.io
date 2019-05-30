#!/bin/bash

Install_SLEMP() 
{

###################
# disable selinux #
###################
setenforce 0
if [ -f "/etc/selinux/config" ];then                                       
 sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
fi

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
mkdir /usr/local/ioncube

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

# mysql repo
rpm -Uvh http://repo.mysql.com/mysql-community-release-el${centos}-5.noarch.rpm

################################
# Install PHP, NGINX and MySQL #
################################

yum -y install nginx

yum -y install mysql mysql-server

yum -y install php${php_version}-php-common php${php_version}-php-fpm php${php_version}-php-process php${php_version}-php-mysql php${php_version}-php-pecl-memcache php${php_version}-php-pecl-memcached php${php_version}-php-gd php${php_version}-php-mbstring php${php_version}-php-mcrypt php${php_version}-php-xml php${php_version}-php-pecl-apc php${php_version}-php-cli php${php_version}-php-pear php${php_version}-php-pdo

#####################################################
# Install Postfix, SyLog-Ng, Cronie and Other Stuff #
#####################################################

yum -y install svn postfix syslog-ng cronie wget libdbi libdbi-drivers libdbi-dbd-mysql syslog-ng-libdbi zip unzip glibc.i686

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
if [ "${php_version}" = "54" ];then
  php_conf="/opt/remi/php${php_version}/root/etc" 
fi
if [ "${php_version}" = "55" ];then
  php_conf="/opt/remi/php${php_version}/root/etc" 
fi
if [ "${php_version}" = "56" ];then
  php_conf="/opt/remi/php${php_version}/root/etc" 
fi
if [ "${php_version}" = "70" ];then
  php_conf="/etc/opt/remi/php${php_version}" 
fi
if [ "${php_version}" = "71" ];then
  php_conf="/etc/opt/remi/php${php_version}" 
fi
if [ "${php_version}" = "72" ];then
  php_conf="/etc/opt/remi/php${php_version}" 
fi
if [ "${php_version}" = "73" ];then
  php_conf="/etc/opt/remi/php${php_version}" 
fi

wget -O /usr/local/ioncube/ioncube_loader_lin_${vphp}.so basoro.id/downloads/ioncube_loader_lin_${vphp}.so -T 20

echo "Write Ioncube Loader to php.ini..."
cat >> ${php_conf}/php.ini <<EOF

;ionCube
zend_extension = /usr/local/ioncube/ioncube_loader_lin_${vphp}.so

EOF

sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/' ${php_conf}/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 100M/' ${php_conf}/php.ini
ln -s ${php_conf}/php.ini /www/server/php/${php_version}/etc/php.ini

cat > ${php_conf}/php-fpm.d/www.conf <<END
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

rm -f /etc/init.d/nginx
wget -O /etc/init.d/nginx basoro.id/downloads/nginx.init -T20
chmod +x /etc/init.d/nginx
ln -sf /usr/sbin/nginx /www/server/nginx/sbin/nginx
ln -sf /etc/nginx/nginx.conf /www/server/nginx/conf/nginx.conf
ln -sf /etc/nginx/mime.types /www/server/nginx/conf/mime.types
ln -sf /etc/nginx/fastcgi_params /www/server/nginx/conf/fastcgi_params
ln -sf /www/server/nginx/conf/pathinfo.conf /etc/nginx/pathinfo.conf
ln -sf /www/server/nginx/conf/proxy.conf /etc/nginx/proxy.conf
ln -sf /www/server/nginx/conf/enable-php-${php_version}.conf /etc/nginx/enable-php-${php_version}.conf
ln -s /www/server/nginx/conf/rewrite /etc/nginx/rewrite
ln -s /www/server/nginx/conf/key /etc/nginx/key

command="nginx -v"
nginxv=$( ${command} 2>&1 )
nginxlocal=$(echo $nginxv | grep -o '[0-9.]*$')
echo $nginxlocal > /www/server/nginx/version.pl

ln -sf /opt/remi/php${php_version}/root/usr/bin/php /www/server/php/${php_version}/bin/php
ln -sf /opt/remi/php${php_version}/root/usr/bin/phpize /www/server/php/${php_version}/bin/phpize
ln -sf /opt/remi/php${php_version}/root/usr/bin/pear /www/server/php/${php_version}/bin/pear
ln -sf /opt/remi/php${php_version}/root/usr/bin/pecl /www/server/php/${php_version}/bin/pecl
ln -sf /opt/remi/php${php_version}/root/usr/sbin/php-fpm /www/server/php/${php_version}/sbin/php-fpm 
if [ -f "/usr/lib/systemd/system/php${php_version}-php-fpm.service" ];then 
  sed -i 's/PrivateTmp=true/PrivateTmp=false/' /usr/lib/systemd/system/php${php_version}-php-fpm.service 
  systemctl daemon-reload
  service php${php_version}-php-fpm start
else 
  mv /etc/init.d/php${php_version}-php-fpm /etc/init.d/php-fpm-${php_version}
  chmod +x /etc/init.d/php-fpm-${php_version}
  /etc/init.d/php-fpm-${php_version} start
fi
echo $vphp > /www/server/php.pl

#################
# Install cloud #
#################

svn export --force https://github.com/basoro/basoro.github.io/trunk/_/cloud/
mv cloud/ /www/server/
chmod +x /www/server/cloud/slemp
chmod +x /www/server/cloud/cloud
mv -f /www/server/cloud/sock.so /lib/sock.so
mv -f /www/server/cloud/spec.so /lib/spec.so
mv -f /www/server/cloud/krnln.so /lib/krnln.so
mv -f /www/server/cloud/iconv.so /lib/iconv.so
mv -f /www/server/cloud/dp1.so /lib/dp1.so
mv -f /www/server/cloud/EThread.so /lib/EThread.so

########################
# install MySQL config #
########################

rm -f /etc/my.cnf
cat > /etc/my.cnf<<EOF
[client]
#password	= your_password
port		= 3306
socket		= /var/lib/mysql/mysql.sock
[mysqld]
port		= 3306
socket		= /var/lib/mysql/mysql.sock
datadir = /www/server/data
default_storage_engine = MyISAM
#skip-external-locking
#loose-skip-innodb
key_buffer_size = 16M
max_allowed_packet = 1M
table_open_cache = 64
sort_buffer_size = 512K
net_buffer_length = 8K
read_buffer_size = 256K
read_rnd_buffer_size = 512K
myisam_sort_buffer_size = 8M
thread_cache_size = 8
query_cache_size = 8M
tmp_table_size = 16M
#skip-networking
max_connections = 500
max_connect_errors = 100
open_files_limit = 65535
log-bin=mysql-bin
binlog_format=mixed
server-id	= 1
expire_logs_days = 10
#default_storage_engine = InnoDB
innodb_data_home_dir = /www/server/data
innodb_data_file_path = ibdata1:10M:autoextend
innodb_log_group_home_dir = /www/server/data
innodb_buffer_pool_size = 8M
innodb_additional_mem_pool_size = 1M
innodb_log_file_size = 2M
innodb_log_buffer_size = 4M
innodb_flush_log_at_trx_commit = 1
innodb_lock_wait_timeout = 50
[mysqldump]
quick
max_allowed_packet = 16M
[mysql]
no-auto-rehash
[myisamchk]
key_buffer_size = 20M
sort_buffer_size = 20M
read_buffer = 2M
write_buffer = 2M
[mysqlhotcopy]
interactive-timeout
EOF

#################
# Install Panel #
#################

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
ln -sf /usr/lib64/libmysqlclient.so.18 /www/server/mysql/lib/libmysqlclient.so
ln -sf /usr/lib64/libmysqlclient.so.18 /www/server/mysql/lib/libmysqlclient.so.18
ln -s /var/lib/mysql/mysql.sock /tmp/mysql.sock
echo "5.6" > /www/server/mysql/version.pl
service mysqld start
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
service mysqld restart
chkconfig mysqld on
service panel start

chown -R www:www /www/wwwroot/default/
chown -R www:www /www/server/panel/

sleep 3

cd ~

#clear
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
}

isCentos7=`cat /etc/redhat-release | grep 7\..* | grep -i centos`

if [ "${isCentos7}" != '' ];then
  centos='7'
else
  centos='6'
fi

echo '=======================================================';
echo 'Your select to install:'
echo '-------------------------------------------------------'
echo 'Web Server: Nginx';
echo 'Database: MySQL';
echo '-------------------------------------------------------'
echo '1) PHP-5.4';
echo '2) PHP-5.5';
echo '3) PHP-5.6';
echo "4) PHP-7.0";
echo "5) PHP-7.1";
echo "6) PHP-7.2";
echo "7) PHP-7.3";
read -p "Plese select to add php version(1-7): " php;
echo '=======================================================';

case "${php}" in
  '1')
    vphp='5.4'
    php_version='54'
    ;;
  '2')
    vphp='5.5'
    php_version='55'
    ;;
  '3')
    vphp='5.6'
    php_version='56'
    ;;
  '4')
    vphp='7.0'
    php_version='70'
    ;;
  '5')
    vphp='7.1'
    php_version='71'
    ;;
  '6')
    vphp='7.2'
    php_version='72'
    ;;
  '7')
    vphp='7.3'
    php_version='73'
    ;;
esac

while [ "$go" != 'y' ] && [ "$go" != 'n' ]
  do
    read -p "About to install at /www, Ready you a start with the PHP-$vphp installation?(y/n): " go;
done
if [ "${go}" == 'n' ];then
  echo 'Your alrea cancel the install.';
  exit 1;
fi
Install_SLEMP
