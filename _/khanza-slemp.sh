#!/bin/bash

#####################################
# SILAHKAN SESUAIKAN YG DIBAWAH INI #
# User : admin                      #
# Pass : nimda                      #
#####################################
printf "admin:$(openssl passwd -crypt nimda)\n" >> ~/.htpasswd

###################
# disable selinux #
###################
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config


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

#Work around OpenVZ's memory allocation limits (if on OpenVZ)
if [ -e "/proc/user_beancounters" ]
then
 echo "* soft stack 256" >/etc/security/limits.conf
  sed -i 's/plugins=1/plugins=0/' /etc/yum.conf
fi

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

yum -y install php56w-fpm php56w-mysql php56w-gd php56w-xml php56w-xmlrpc php56w-mbstring php56w-mcrypt php56w-process

########################################
# Install Postfix, SyLog-Ng and Cronie #
########################################

yum -y install postfix syslog-ng cronie
yum -y install libdbi
yum -y install libdbi-drivers
yum -y install libdbi-dbd-mysql
yum -y install syslog-ng-libdbi
yum -y install zip unzip

########################
# install MySQL config #
########################



cat > /etc/my.cnf <<END
[mysqld]
default-storage-engine = myisam
key_buffer_size = 1M
query_cache_size = 1M
query_cache_limit = 128k
max_connections=25
thread_cache_size=1
skip-innodb
query_cache_min_res_unit=0
tmp_table_size = 1M
max_heap_table_size = 1M
table_cache=256
concurrent_insert=2
max_allowed_packet = 1M
sort_buffer_size = 64K
read_buffer_size = 256K
read_rnd_buffer_size = 256K
net_buffer_length = 2K
thread_stack = 64K
END
echo  Do not worry if you see a error stopping MySQL
/etc/init.d/mysqld stop


###################
# Configure nginx #
###################

cat > /etc/nginx/php <<END
index index.php index.html index.htm;

location ~ \.php$ {

   include fastcgi_params;
    fastcgi_intercept_errors on;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
  try_files \$uri =404;
    fastcgi_pass 127.0.0.1:9000;
    error_page 404 /404page.html; #makes nginx return it's default 404
#       page instead of a blank page

}
END

cat > /etc/nginx/nginx.conf <<END
user              nginx nginx;
worker_processes  1;


pid               /var/run/nginx.pid;

events {
    worker_connections  2048;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    client_max_body_size 64M;
    sendfile        on;
    tcp_nopush      on;

    keepalive_timeout  3;

    gzip  on;
    gzip_comp_level 2;
    gzip_proxied any;
    gzip_types      text/plain text/css application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    server_tokens off;

    fastcgi_buffers 8 16k;
    fastcgi_buffer_size 32k;
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    
    include /etc/nginx/conf.d/*;
}
END
rm /etc/nginx/conf.d/*
cat > /etc/nginx/conf.d/default.conf <<END
server {
    listen 80 default;
    server_name _;
    root /var/www/html;
    include php;

  }
server {
    listen 8888;
    server_name localhost;
    root /var/www/panel;
    auth_basic            "Panel Auth";
    auth_basic_user_file  "/etc/nginx/.htpasswd";
    include php;

  }
END

mv ~/.htpasswd /etc/nginx/.htpasswd

#install php-fpm config
cat > /etc/php-fpm.d/www.conf <<END
[www]
listen = 127.0.0.1:9000
listen.allowed_clients = 127.0.0.1
user = nginx
group = nginx
pm = ondemand
pm.process_idle_timeout = 3s
pm.max_children = 5
pm.start_servers = 1
pm.min_spare_servers = 1
pm.max_spare_servers = 1
pm.max_requests = 500
php_admin_value[error_log] = /var/log/php-fpm/www-error.log
php_admin_flag[log_errors] = on
php_admin_value[upload_max_filesize] = 32M
END

sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/' /etc/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 100M/' /etc/php.ini

#Create directories
mkdir /var/www
mkdir /var/www/html/
mkdir /var/www/panel
mkdir /var/www/logs/
mkdir /usr/share/nginx/logs/

curl -o /var/www/panel/tinyfilemanager.php https://raw.githubusercontent.com/basoro/basoro.github.io/master/_/filemanager.php
curl -o /var/www/panel/phpminiadmin.php https://raw.githubusercontent.com/osalabs/phpminiadmin/master/phpminiadmin.php

cat > /var/www/html/index.php <<END
<h1>Simple LEMP</h1><br>
(Linux Engine-X MySQL PHP)<br>
END

cat > /var/www/panel/index.php <<END
<h1>Simple LEMP Panel</h1><br>
(Linux Engine-X MySQL PHP)<br>
<a href="filemanager.php" target="_blank">Tiny Filemanager</a> |
<a href="phpminiadmin.php" target="_blank">PHP Mini MySQL Admin</a> |
<a href="http://<?php echo \$_SERVER['SERVER_ADDR']; ?>/webapps/">Webapps</a> |
<a href="http://<?php echo \$_SERVER['SERVER_ADDR']; ?>/SIMRS-Khanza.zip">Download SIMRS-Khanza</a>
<br><br><br>
<h3>OS</h3>
  <pre>Distro: Linux Centos</pre>
  <pre>Hostname: <?php echo shell_exec('uname -n'); ?></pre>
  <pre>Kernel: <?php echo shell_exec('uname -r'); ?></pre>
  <pre>Uptime: <?php echo shell_exec("uptime | awk '{print \$3,\$4,\$5}' | sed 's/,$//'"); ?></pre>
<h3>System</h3>
  <pre>CPU: <?php echo shell_exec("cat /proc/cpuinfo | grep \"model name\" | awk '{print \$4,\$5,\$6,\$7,\$8,\$9}' | tail -1"); ?></pre>
  <pre>CPU Cores: <?php echo exec("cat /proc/cpuinfo | grep processor | tail -1 | awk '{print \$3+1}'") ?></pre>
  <pre>RAM: <?php echo exec("free -m | grep Mem | awk '{print \$2}'"); ?>MB</pre>
<h3>IP Addresses</h3>
  <pre><?php echo exec("curl -s http://whatismyip.akamai.com"); ?></pre>
  <pre><?php echo shell_exec("/sbin/ifconfig | grep \"inet addr\" | awk '{print \$2}' | cut -d ':' -f 2 | cut -d ':' -f 1"); ?></pre>
<h3>Memory</h3>
  <pre><?php echo shell_exec("free -m"); ?></pre>
<h3>CPU</h3>
  <pre><?php echo exec("uptime | awk '{print \$8,\$9,\$10,\$11,\$12}'"); ?></pre>
<h3>Disk</h3>
  <pre><?php echo shell_exec("df -h | grep Filesystem"); ?></pre>
  <pre><?php echo shell_exec("df -h | grep /dev/vd"); ?></pre>
  <pre><?php echo shell_exec("df -h | grep /dev/sh"); ?></pre>
<h3>Logged in users</h3>
  <pre><?php echo shell_exec("w"); ?></pre>
END

#add users, start services and configure iptables
service php-fpm start
chkconfig php-fpm on
iptables -I INPUT -p tcp --dport 80 -j ACCEPT
iptables -I INPUT -p tcp --dport 3306 -j ACCEPT
iptables -I INPUT -p tcp --dport 8888 -j ACCEPT
service iptables save
chkconfig syslog-ng on
service syslog-ng start
chkconfig crond on
service crond start
service nginx restart
chkconfig nginx on
chkconfig mysqld on
service mysqld start
echo 'nginx ALL=(ALL) NOPASSWD: ALL' | sudo EDITOR='tee -a' visudo

yum -y install svn

cd /var/www/html

svn export --force https://github.com/mas-elkhanza/SIMRS-Khanza.git/trunk/webapps
svn export --force https://github.com/mas-elkhanza/SIMRS-Khanza.git/trunk/dist
mv dist SIMRS-Khanza
svn export --force https://github.com/mas-elkhanza/SIMRS-Khanza.git/trunk/KhanzaAntrianLoket/dist/suara
mv suara SIMRS-Khanza/
svn export --force https://github.com/mas-elkhanza/SIMRS-Khanza.git/trunk/KhanzaAntrianLoket/dist/KhanzaAntrianLoket.jar
mv KhanzaAntrianLoket.jar SIMRS-Khanza/antrianloket.jar
svn export --force https://github.com/mas-elkhanza/SIMRS-Khanza.git/trunk/KhanzaAntrianPoli/dist/KhanzaAntrianPoli.jar
mv KhanzaAntrianPoli.jar SIMRS-Khanza/antrianpoli.jar
svn export --force https://github.com/mas-elkhanza/SIMRS-Khanza.git/trunk/KhanzaHMSAnjungan/dist/KhanzaHMSAnjungan.jar
mv KhanzaHMSAnjungan.jar SIMRS-Khanza/anjunganmandiri.jar
svn export --force https://github.com/mas-elkhanza/SIMRS-Khanza.git/trunk/KhanzaPengenkripsiTeks/dist/KhanzaPengenkripsiTeks.jar
mv KhanzaPengenkripsiTeks.jar SIMRS-Khanza/pengenkripsiteks.jar
zip -r SIMRS-Khanza.zip SIMRS-Khanza
rm -rf SIMRS-Khanza

curl -o sik.sql https://raw.githubusercontent.com/mas-elkhanza/SIMRS-Khanza/master/sik.sql
mysql --user=root -e "create database sik"
mysql --user=root --password='' sik < sik.sql
mysql --user=root --password='' --database=mysql -e "UPDATE user SET Host = '%' WHERE Host='127.0.0.1'";
service mysqld restart

chown -R nginx:nginx /var/www/html/
chown -R nginx:nginx /var/www/panel/

#Fix Sessions:
mkdir /var/lib/php/session
chmod 777 /var/lib/php/session

sleep 3

cd ~

clear
echo Instalasi server selesai.
echo
echo Silahkan akses Panel LEMP di http://ipaddress:8888
echo Username = admin
echo Password = nimda
echo
echo
echo jalankan
echo /usr/bin/mysql_secure_installation
echo untuk mengganti password mysql user root
echo
echo
exit
