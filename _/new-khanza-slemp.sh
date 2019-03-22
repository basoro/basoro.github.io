#!/bin/bash

###################
# disable selinux #
###################
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

startTime=`date +%s`

##############################
# disable un-needed services #
##############################
service httpd stop
chkconfig httpd off
service xinetd stop
chkconfig xinetd off
service saslauthd stop
chkconfig saslauthd off
service sendmail stop
chkconfig sendmail off
service rsyslog stop

groupadd www
useradd -s /sbin/nologin -g www www

#Create directories
mkdir -pv /www/{wwwroot/default,wwwlogs,server/{panel,mysql/{bin,lib},nginx/{sbin,logs,conf/{vhost,rewrite}},pure-ftpd/{etc,sbin},php/56/{etc,bin,sbin,var/run}}}

#remove all current PHP, MySQL, mailservers, rsyslog.
yum -y remove httpd php mysql rsyslog sendmail postfix mysql-libs

###################
# Add a few repos #
###################

# nginx repo
rpm -Uvh http://nginx.org/packages/rhel/6/noarch/RPMS/nginx-release-rhel-6-0.el6.ngx.noarch.rpm

# epel-release repo
yum -y install epel-release

# php56 repo
rpm -Uvh http://mirror.webtatic.com/yum/el6/latest.rpm

################################
# Install PHP, NGINX and MySQL #
################################

yum -y install nginx

yum -y install mysql55w mysql55w-server

yum -y install php56w-fpm php56w-mysql php56w-gd php56w-xml php56w-xmlrpc php56w-pear php56w-mbstring php56w-mcrypt php56w-process

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

cat > /www/server/nginx/conf/enable-php-56.conf <<END
location ~ [^/]\.php(/|$)
{
    try_files \$uri =404;
    fastcgi_pass  unix:/tmp/php-cgi-56.sock;
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
    server {
        listen 80 default;
        server_name _;
        index index.html index.htm index.php;
        root /www/wwwroot/default;
        include enable-php-56.conf;
    }

    server{
        listen 888;
        server_name basoro.id;
        index index.html index.htm index.php;
        root  /www/server/panel;

        #error_page   404   /404.html;
        include enable-php-56.conf;
        access_log  /www/wwwlogs/access.log;
    }
    include /www/server/nginx/conf/vhost/*.conf;
}
END
rm /etc/nginx/conf.d/*

#install php-fpm config
cat > /etc/php-fpm.d/www.conf <<END
[www]
listen = /tmp/php-cgi-56.sock
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
ln -sf /www/server/nginx/conf/enable-php-56.conf /etc/nginx/enable-php-56.conf
ln -s /www/server/nginx/conf/rewrite /etc/nginx/rewrite
ln -s /www/server/nginx/conf/key /etc/nginx/key

ln -sf /usr/bin/php /www/server/php/56/bin/php
ln -sf /usr/bin/phpize /www/server/php/56/bin/phpize
ln -sf /usr/bin/pear /www/server/php/56/bin/pear
ln -sf /usr/bin/pecl /www/server/php/56/bin/pecl
ln -sf /usr/sbin/php-fpm /www/server/php/56/sbin/php-fpm
ln -sf /etc/php.ini /www/server/php/56/etc/php.ini
ln -sf /var/run/php-fpm/php-fpm.pid /www/server/php/56/var/run/php-fpm.pid

# Install cloud
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
rm -f cloud.zip

mv -f /etc/init.d/php-fpm /etc/init.d/php-fpm-56
#sed -i 's/php-fpm-56/php-fpm/' /www/server/cloud/cloud
#sed -i 's/pkill -9 php-cgi/pkill -9 php-fpm/' /www/server/cloud/cloud

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
loose-skip-innodb
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

# Install Panel

wget -c https://github.com/tiredbug/panel/archive/master.zip -T20
#wget -c cloud.basoro.id/downloads/default.zip -T20
mv master.zip default.zip
rm -rf /www/server/panel/*
unzip -o default.zip -d /www/server/ > /dev/null 2>&1
#unzip -o default.zip -d /www/server/panel/ > /dev/null 2>&1
cp -a /www/server/panel-master/* /www/server/panel/
chown -R www:www /www/server/panel > /dev/null 2>&1
rm -rf /www/server/panel-master/
rm -f default.zip
wget -O phpMyAdmin.zip basoro.id/downloads/phpMyAdmin-4.4.15.6.zip -T20
unzip -o phpMyAdmin.zip -d /www/server/panel/ > /dev/null 2>&1
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
ln -s /usr/lib64/mysql/libmysqlclient.so.18 /www/server/mysql/lib/libmysqlclient.so
ln -s /usr/lib64/mysql/libmysqlclient.so.18 /www/server/mysql/lib/libmysqlclient.so.18
ln -sf /var/lib/mysql/mysql.sock /tmp/mysql.sock
echo "5.5.54" > /www/server/mysql/version.pl
/etc/init.d/mysqld start
sleep 5
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
rm -f phpMyAdmin.zip

# Install Pure-Ftpd
yum -y install pure-ftpd
ln -sf /usr/sbin/pure-config.pl /www/server/pure-ftpd/sbin/pure-config.pl
ln -sf /etc/pure-ftpd/pure-ftpd.conf /www/server/pure-ftpd/etc/pure-ftpd.conf 

#start services and configure iptables
iptables -I INPUT -p tcp --dport 20 -j ACCEPT
iptables -I INPUT -p tcp --dport 80 -j ACCEPT
iptables -I INPUT -p tcp --dport 888 -j ACCEPT
iptables -I INPUT -p tcp --dport 3306 -j ACCEPT
service iptables save
chkconfig syslog-ng on
service syslog-ng start
chkconfig crond on
service crond start
service nginx restart
chkconfig nginx on
service php-fpm-56 start
chkconfig php-fpm-56 on
service mysqld start
chkconfig mysqld on
service pure-ftpd start
chkconfig pure-ftpd on
service panel start

chown -R www:www /www/wwwroot/default/
chown -R www:www /www/server/panel/

#Fix Sessions:
mkdir /var/lib/php/session
chmod 777 /var/lib/php/session

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
