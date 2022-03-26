#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

. /opt/slemp/server/panel/script/public.sh
download_Url=http://basoro.id/downloads/slemp

Root_Path=`cat /var/slemp_setupPath.conf`
Setup_Path=$Root_Path/server/php
php_path=$Root_Path/server/php
mysql_dir=$Root_Path/server/mysql
mysql_config="${mysql_dir}/bin/mysql_config"
Is_64bit=`getconf LONG_BIT`
run_path='/root'

php_56='5.6.40'
php_70='7.0.33'
php_71='7.1.30'
php_72='7.2.19'
php_73='7.3.6'
opensslVersion="1.0.2r"
curlVersion="7.64.1"

if [ -z "${cpuCore}" ]; then
	cpuCore="1"
fi

Service_Add(){
	if [ "${PM}" == "yum" ] || [ "${PM}" == "dnf" ]; then
		chkconfig --add php-fpm-${php_version}
		chkconfig --level 2345 php-fpm-${php_version} on

	elif [ "${PM}" == "apt-get" ]; then
		update-rc.d php-fpm-${php_version} defaults
	fi
}
Service_Del(){
	if [ "${PM}" == "yum" ] || [ "${PM}" == "dnf" ]; then
		chkconfig --del php-fpm-${php_version}
		chkconfig --level 2345 php-fpm-${php_version} off
	elif [ "${PM}" == "apt-get" ]; then
		update-rc.d php-fpm-${php_version} remove
	fi
}
Install_Libsodium(){
	if [ ! -f "/usr/local/libsodium/lib/libsodium.so" ];then
		libsodiumVer="1.0.17"
		wget ${download_Url}/src/libsodium-${libsodiumVer}.tar.gz
		tar -xvf libsodium-${libsodiumVer}.tar.gz
		rm -f libsodium-${libsodiumVer}.tar.gz
		cd libsodium-${libsodiumVer}
		./configure --prefix=/usr/local/libsodium
		make -j${cpuCore}
		make install
		cd ..
		rm -rf libsodium-${libsodiumVer}
	fi
}
Install_Openssl()
{
	if [ ! -f "/usr/local/openssl/bin/openssl" ];then
		cd ${run_path}
		wget ${download_Url}/src/openssl-${opensslVersion}.tar.gz
		tar -zxf openssl-${opensslVersion}.tar.gz
		cd openssl-${opensslVersion}
		./config --openssldir=/usr/local/openssl zlib-dynamic shared
		make -j${cpuCore}
		make install
		echo  "/usr/local/openssl/lib" > /etc/ld.so.conf.d/zopenssl.conf
		ldconfig
		cd ..
		rm -f openssl-${opensslVersion}.tar.gz
		rm -rf openssl-${opensslVersion}
	fi
}
Install_Curl()
{
	if [ ! -f "/usr/local/curl/bin/curl" ];then
		wget ${download_Url}/src/curl-${curlVersion}.tar.gz
		tar -zxf curl-${curlVersion}.tar.gz
		cd curl-${curlVersion}
		./configure --prefix=/usr/local/curl --enable-ares --without-nss --with-ssl=/usr/local/openssl
		make -j${cpuCore}
		make install
		cd ..
		rm -f curl-${curlVersion}.tar.gz
		rm -rf curl-${curlVersion}
	fi
}
Install_Icu4c(){
	cd ${run_path}
	icu4cVer=$(/usr/bin/icu-config --version)
	if [ ! -f "/usr/bin/icu-config" ] || [ "${icu4cVer:0:2}" -gt "60" ];then
		wget -O icu4c-60_3-src.tgz ${download_Url}/src/icu4c-60_3-src.tgz
		tar -xvf icu4c-60_3-src.tgz
		cd icu/source
		./configure --prefix=/usr/local/icu
		make -j${cpuCore}
		make install
		[ -f "/usr/bin/icu-config" ] && mv /usr/bin/icu-config /usr/bin/icu-config.bak
		ln -sf /usr/local/icu/bin/icu-config /usr/bin/icu-config
		echo "/usr/local/icu/lib" > /etc/ld.so.conf.d/zicu.conf
		ldconfig
		cd ../
		rm -rf icu*
	fi
}
Create_Fpm(){
	cat >${php_setup_path}/etc/php-fpm.conf<<EOF
[global]
pid = ${php_setup_path}/var/run/php-fpm.pid
error_log = ${php_setup_path}/var/log/php-fpm.log
log_level = notice

[www]
listen = /tmp/php-cgi-${php_version}.sock
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
listen.owner = www
listen.group = www
listen.mode = 0666
user = www
group = www
pm = dynamic
pm.status_path = /phpfpm_${php_version}_status
pm.max_children = 30
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 10
request_terminate_timeout = 100
request_slowlog_timeout = 30
slowlog = var/log/slow.log
EOF
}

Set_PHP_FPM_Opt()
{
	MemTotal=`free -m | grep Mem | awk '{print  $2}'`
	if [[ ${MemTotal} -gt 1024 && ${MemTotal} -le 2048 ]]; then
		sed -i "s#pm.max_children.*#pm.max_children = 50#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.start_servers.*#pm.start_servers = 5#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 5#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 10#" ${php_setup_path}/etc/php-fpm.conf
	elif [[ ${MemTotal} -gt 2048 && ${MemTotal} -le 4096 ]]; then
		sed -i "s#pm.max_children.*#pm.max_children = 80#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.start_servers.*#pm.start_servers = 5#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 5#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 20#" ${php_setup_path}/etc/php-fpm.conf
	elif [[ ${MemTotal} -gt 4096 && ${MemTotal} -le 8192 ]]; then
		sed -i "s#pm.max_children.*#pm.max_children = 150#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.start_servers.*#pm.start_servers = 10#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 10#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 30#" ${php_setup_path}/etc/php-fpm.conf
	elif [[ ${MemTotal} -gt 8192 && ${MemTotal} -le 16384 ]]; then
		sed -i "s#pm.max_children.*#pm.max_children = 200#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.start_servers.*#pm.start_servers = 15#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 15#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 30#" ${php_setup_path}/etc/php-fpm.conf
	elif [[ ${MemTotal} -gt 16384 ]]; then
		sed -i "s#pm.max_children.*#pm.max_children = 300#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.start_servers.*#pm.start_servers = 20#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 20#" ${php_setup_path}/etc/php-fpm.conf
		sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 50#" ${php_setup_path}/etc/php-fpm.conf
	fi
}

Set_Phpini(){
	sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
	sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
	sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
	sed -i 's/short_open_tag =.*/short_open_tag = On/g' ${php_setup_path}/etc/php.ini
	sed -i 's/;cgi.fix_pathinfo=.*/cgi.fix_pathinfo=1/g' ${php_setup_path}/etc/php.ini
	sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
	sed -i 's/;sendmail_path =.*/sendmail_path = \/usr\/sbin\/sendmail -t -i/g' ${php_setup_path}/etc/php.ini
	sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,popen,proc_open,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
	sed -i 's/display_errors = Off/display_errors = On/g' ${php_setup_path}/etc/php.ini
	sed -i 's/error_reporting =.*/error_reporting = E_ALL \& \~E_NOTICE/g' ${php_setup_path}/etc/php.ini

	if [ "${php_version}" = "52" ]; then
		sed -i "s#extension_dir = \"./\"#extension_dir = \"${php_setup_path}/lib/php/extensions/no-debug-non-zts-20060613/\"\n#" ${php_setup_path}/etc/php.ini
		sed -i 's#output_buffering =.*#output_buffering = On#' ${php_setup_path}/etc/php.ini
		sed -i 's/; cgi.force_redirect = 1/cgi.force_redirect = 0;/g' ${php_setup_path}/etc/php.ini
		sed -i 's/; cgi.redirect_status_env = ;/cgi.redirect_status_env = "yes";/g' ${php_setup_path}/etc/php.ini
	fi

	if [ "${php_version}" -ge "56" ]; then
		if [ -f "/etc/pki/tls/certs/ca-bundle.crt" ];then
			crtPath="/etc/pki/tls/certs/ca-bundle.crt"
		elif [ -f "/etc/ssl/certs/ca-certificates.crt" ]; then
			crtPath="/etc/ssl/certs/ca-certificates.crt"
		fi
		sed -i "s#;openssl.cafile=#openssl.cafile=${crtPath}#" ${php_setup_path}/etc/php.ini
		sed -i "s#;curl.cainfo =#curl.cainfo = ${crtPath}#" ${php_setup_path}/etc/php.ini
	fi

	sed -i 's/expose_php = On/expose_php = Off/g' ${php_setup_path}/etc/php.ini

}

Export_PHP_Autoconf()
{
	export PHP_AUTOCONF=/usr/local/autoconf-2.13/bin/autoconf
	export PHP_AUTOHEADER=/usr/local/autoconf-2.13/bin/autoheader
}

Ln_PHP_Bin()
{
	rm -f /usr/bin/php*
	rm -f /usr/bin/pear
	rm -f /usr/bin/pecl

    ln -sf ${php_setup_path}/bin/php /usr/bin/php
    ln -sf ${php_setup_path}/bin/phpize /usr/bin/phpize
    ln -sf ${php_setup_path}/bin/pear /usr/bin/pear
    ln -sf ${php_setup_path}/bin/pecl /usr/bin/pecl
    ln -sf ${php_setup_path}/sbin/php-fpm /usr/bin/php-fpm
}

Pear_Pecl_Set()
{
    pear config-set php_ini ${php_setup_path}/etc/php.ini
    pecl config-set php_ini ${php_setup_path}/etc/php.ini
}

Install_Composer()
{
	if [ ! -f "/usr/bin/composer" ];then
		wget -O /usr/bin/composer ${download_Url}/src/composer.phar -T 20;
		chmod +x /usr/bin/composer
		composer config -g repo.packagist composer https://packagist.phpcomposer.com
	fi
}

fpmPhpinfo(){
	nginxPhpStatus=$(cat /opt/slemp/server/panel/data/vhost/phpfpm_status.conf |grep 73)
	if [ "${nginxPhpStatus}" == "" ]; then
		rm -f /opt/slemp/server/panel/data/vhost/phpfpm_status.conf
		wget -O /opt/slemp/server/panel/data/vhost/phpfpm_status.conf ${download_Url}/conf/phpfpm_status.conf
	fi
	nginxPhpinfo=$(cat /opt/slemp/server/panel/data/vhost/phpinfo.conf |grep 73)
	if [ "${nginxPhpinfo}" == "" ]; then
		rm -f /opt/slemp/server/panel/data/vhost/phpinfo.conf
		wget -O /opt/slemp/server/panel/data/vhost/phpinfo.conf ${download_Url}/conf/phpinfo.conf
	fi
}

Uninstall_Zend(){
	sed -i "/zend_optimizer/s/^/;/" /opt/slemp/server/php/${php_version}/etc/php.ini
	sed -i "/zend_extension/s/^/;/" /opt/slemp/server/php/${php_version}/etc/php.ini
	sed -i "/zend_loader/s/^/;/" /opt/slemp/server/php/${php_version}/etc/php.ini
	/etc/init.d/php-fpm-${php_version} restart
}

Install_PHP_56()
{
	cd ${run_path}
	php_version="56"
	/etc/init.d/php-fpm-$php_version stop
	php_setup_path=${php_path}/${php_version}

	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/src.tar.gz" ];then
		wget -O ${php_setup_path}/src.tar.gz https://museum.php.net/php5/php-5.6.40.tar.gz -T20
	fi

	tar zxf src.tar.gz
	mv php-${php_56} src
	cd src
	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --with-mcrypt --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-calendar --enable-soap --with-gettext --disable-fileinfo --enable-opcache --enable-intl
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make -j${cpuCore}
	make install

	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-5.6 installation failed.\033[0m";
		rm -rf ${php_setup_path}
		exit 0;
	fi

	Ln_PHP_Bin

	echo "Copy new php configure file..."
	mkdir -p ${php_setup_path}/etc
	\cp php.ini-production ${php_setup_path}/etc/php.ini

	cd ${php_setup_path}
	# php extensions
	Set_Phpini
	Pear_Pecl_Set
	Install_Composer

	echo "Install ZendGuardLoader for PHP 5.6..."
	mkdir -p /usr/local/zend/php56
	if [ "${Is_64bit}" = "64" ] ; then
		wget ${download_Url}/src/zend-loader-php5.6-linux-x86_64.tar.gz -T20
		tar zxf zend-loader-php5.6-linux-x86_64.tar.gz
		\cp zend-loader-php5.6-linux-x86_64/ZendGuardLoader.so /usr/local/zend/php56/
		rm -rf zend-loader-php5.6-linux-x86_64
		rm -f zend-loader-php5.6-linux-x86_64.tar.gz
	fi

	echo "Write ZendGuardLoader to php.ini..."
cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

;opcache

[Zend ZendGuard Loader]
zend_extension=/usr/local/zend/php56/ZendGuardLoader.so
zend_loader.enable=1
zend_loader.disable_licensing=0
zend_loader.obfuscation_level_support=3
zend_loader.license_path=

;xcache

EOF

	Create_Fpm
	Set_PHP_FPM_Opt
	echo "Copy php-fpm init.d file..."
	\cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-56
	chmod +x /etc/init.d/php-fpm-56

	Service_Add

	rm -f /tmp/php-cgi-56.sock
	/etc/init.d/php-fpm-56 start
	rm -f ${php_setup_path}/src.tar.gz
	echo "${php_56}" > ${php_setup_path}/version.pl
}

Install_PHP_70()
{
	cd ${run_path}
	php_version="70"
	/etc/init.d/php-fpm-$php_version stop
	php_setup_path=${php_path}/${php_version}

	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/src.tar.gz" ];then
		wget -O ${php_setup_path}/src.tar.gz http://www.php.net/distributions/php-${php_70}.tar.gz -T20
	fi

	tar zxf src.tar.gz
	mv php-${php_70} src
	cd src
	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --with-mcrypt --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-calendar --enable-soap --with-gettext --disable-fileinfo --enable-opcache
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
    fi
    make ZEND_EXTRA_LIBS='-liconv' -j${cpuCore}
    make install

	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-7.0 installation failed.\033[0m";
		rm -rf ${php_setup_path}
		exit 0;
	fi

	Ln_PHP_Bin

	echo "Copy new php configure file..."
	mkdir -p ${php_setup_path}/etc
	\cp php.ini-production ${php_setup_path}/etc/php.ini

	cd ${php_setup_path}
	# php extensions
	Set_Phpini
	Pear_Pecl_Set
	Install_Composer

	echo "Install ZendGuardLoader for PHP 7..."
	echo "unavailable now."

	echo "Write ZendGuardLoader to php.ini..."
cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

;opcache

[Zend ZendGuard Loader]
;php7 do not support zendguardloader @Sep.2015,after support you can uncomment the following line.
;zend_extension=/usr/local/zend/php70/ZendGuardLoader.so
;zend_loader.enable=1
;zend_loader.disable_licensing=0
;zend_loader.obfuscation_level_support=3
;zend_loader.license_path=

;xcache

EOF

	Create_Fpm
	Set_PHP_FPM_Opt
	\cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-70
	chmod +x /etc/init.d/php-fpm-70

	Service_Add

	rm -f /tmp/php-cgi-70.sock
	/etc/init.d/php-fpm-70 start
	rm -f ${php_setup_path}/src.tar.gz
	echo "${php_70}" > ${php_setup_path}/version.pl
}

Install_PHP_71()
{
	cd ${run_path}
	php_version="71"
	/etc/init.d/php-fpm-$php_version stop
	php_setup_path=${php_path}/${php_version}

	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/src.tar.gz" ];then
		wget -O ${php_setup_path}/src.tar.gz http://www.php.net/distributions/php-${php_71}.tar.gz -T20
	fi

	tar zxf src.tar.gz
	mv php-${php_71} src
	cd src
	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --with-mcrypt --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-calendar --enable-soap --with-gettext --disable-fileinfo --enable-opcache
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make -j${cpuCore}
	make install

	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-7.1 installation failed.\033[0m";
		rm -rf ${php_setup_path}
		exit 0;
	fi

	Ln_PHP_Bin

	echo "Copy new php configure file..."
	mkdir -p ${php_setup_path}/etc
	\cp php.ini-production ${php_setup_path}/etc/php.ini

	cd ${php_setup_path}
	# php extensions
	Set_Phpini
	Pear_Pecl_Set
	Install_Composer

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

	Create_Fpm
	Set_PHP_FPM_Opt
	\cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-71
	chmod +x /etc/init.d/php-fpm-71

	Service_Add

	rm -f /tmp/php-cgi-71.sock
	/etc/init.d/php-fpm-71 start
	if [ -d "$Root_Path/server/nginx" ];then
		wget -O $Root_Path/server/nginx/conf/enable-php-71.conf ${download_Url}/conf/enable-php-71.conf -T20
	fi
	rm -f ${php_setup_path}/src.tar.gz
	echo "${php_71}" > ${php_setup_path}/version.pl
}

Install_PHP_72()
{
	cd ${run_path}
	php_version="72"
	/etc/init.d/php-fpm-$php_version stop
	php_setup_path=${php_path}/${php_version}

	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/src.tar.gz" ];then
		wget -O ${php_setup_path}/src.tar.gz http://www.php.net/distributions/php-${php_72}.tar.gz -T20
	fi

	tar zxf src.tar.gz
	mv php-${php_72} src
	cd src
	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-calendar --enable-soap --with-gettext --disable-fileinfo --enable-opcache
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make ZEND_EXTRA_LIBS='-liconv' -j${cpuCore}
	make install

	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-7.2 installation failed.\033[0m";
		rm -rf ${php_setup_path}
		exit 0;
	fi

	Ln_PHP_Bin

	echo "Copy new php configure file..."
	mkdir -p ${php_setup_path}/etc
	\cp php.ini-production ${php_setup_path}/etc/php.ini

	cd ${php_setup_path}
	# php extensions
	Set_Phpini
	Pear_Pecl_Set
	Install_Composer

	echo "Install ZendGuardLoader for PHP 7..."
	echo "unavailable now."

	echo "Write ZendGuardLoader to php.ini..."
cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

;opcache

[Zend ZendGuard Loader]
;php7 do not support zendguardloader @Sep.2015,after support you can uncomment the following line.
;zend_extension=/usr/local/zend/php72/ZendGuardLoader.so
;zend_loader.enable=1
;zend_loader.disable_licensing=0
;zend_loader.obfuscation_level_support=3
;zend_loader.license_path=

;xcache

EOF

	Create_Fpm
	Set_PHP_FPM_Opt
	\cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-72
	chmod +x /etc/init.d/php-fpm-72

	Service_Add

	rm -f /tmp/php-cgi-72.sock
	/etc/init.d/php-fpm-72 start
	if [ -d "$Root_Path/server/nginx" ];then
		wget -O $Root_Path/server/nginx/conf/enable-php-72.conf ${download_Url}/conf/enable-php-72.conf -T20
	fi

	rm -f ${php_setup_path}/src.tar.gz
	echo "${php_72}" > ${php_setup_path}/version.pl
}
Install_PHP_73()
{
	cd ${run_path}
	php_version="73"
	/etc/init.d/php-fpm-$php_version stop


	LibCurlVer=$(/usr/local/curl/bin/curl -V|grep curl|awk '{print $2}'|cut -d. -f2)
	if [[ "${LibCurlVer}" -le "60" ]]; then
		if [ ! -f "/usr/local/curl2/bin/curl" ];then
			curlVer="7.64.1"
			wget ${download_Url}/src/curl-${curlVer}.tar.gz
			tar -xvf curl-${curlVer}.tar.gz
			cd curl-${curlVer}
			./configure --prefix=/usr/local/curl2 --enable-ares --without-nss --with-ssl=/usr/local/openssl
			make -j${cpuCore}
			make install
			cd ..
			rm -rf curl*
		fi
	fi

	php_setup_path=${php_path}/${php_version}

	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/src.tar.gz" ];then
		wget -O ${php_setup_path}/src.tar.gz http://www.php.net/distributions/php-${php_73}.tar.gz -T20
	fi

	if [ -f "/usr/local/curl2/bin/curl" ]; then
		withOpenssl="/usr/local/curl2"
	else
		withOpenssl="/usr/local/curl"
	fi

	tar zxf src.tar.gz
	mv php-${php_73} src
	cd src
	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=${withOpenssl} --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --enable-ftp --with-gd --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc  --enable-soap --with-gettext --disable-fileinfo --enable-opcache --enable-zip --enable-calendar --without-libzip
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make ZEND_EXTRA_LIBS='-liconv' -j${cpuCore}
	make install

	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-7.3 installation failed.\033[0m";
		rm -rf ${php_setup_path}
		exit 0;
	fi

	# cd ${php_setup_path}/src/ext/zip
	# ${php_setup_path}/bin/phpize
	# ./configure --enable-zip --enable-calendar --with-php-config=${php_setup_path}/bin/php-config
	# make && make install
	# cd ../../
	Ln_PHP_Bin

	echo "Copy new php configure file..."
	mkdir -p ${php_setup_path}/etc
	\cp php.ini-production ${php_setup_path}/etc/php.ini

	cd ${php_setup_path}
	# php extensions
	Set_Phpini
	if [ -f "/opt/slemp/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/zip.so" ];then
		echo "extension = zip.so" >> ${php_setup_path}/etc/php.ini
	fi
	Pear_Pecl_Set
	Install_Composer

	echo "Install ZendGuardLoader for PHP 7..."
	echo "unavailable now."

	echo "Write ZendGuardLoader to php.ini..."
cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

;opcache

[Zend ZendGuard Loader]
;php7 do not support zendguardloader @Sep.2015,after support you can uncomment the following line.
;zend_extension=/usr/local/zend/php72/ZendGuardLoader.so
;zend_loader.enable=1
;zend_loader.disable_licensing=0
;zend_loader.obfuscation_level_support=3
;zend_loader.license_path=

;xcache

EOF

	Create_Fpm
	Set_PHP_FPM_Opt
	\cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-73
	chmod +x /etc/init.d/php-fpm-73

	Service_Add

	rm -f /tmp/php-cgi-73.sock
	fpmPhpinfo
	/etc/init.d/php-fpm-73 start
	if [ -d "$Root_Path/server/nginx" ];then
		wget -O $Root_Path/server/nginx/conf/enable-php-73.conf ${download_Url}/conf/enable-php-73.conf -T20
	fi

	rm -f ${php_setup_path}/src.tar.gz
	echo "${php_73}" > ${php_setup_path}/version.pl
}
Update_PHP_56()
{
	cd ${run_path}
	php_version="56"
	php_setup_path=${php_path}/${php_version}
	php_update_path=${php_path}/${php_version}/update

	mkdir -p ${php_update_path}
	rm -rf ${php_update_path}/*

	cd ${php_update_path}
	if [ ! -f "${php_update_path}/src.tar.gz" ];then
		wget -O ${php_update_path}/src.tar.gz http://www.php.net/distributions/php-${php_56}.tar.gz -T20
	fi
	tar zxf src.tar.gz
	mv php-${php_56} src
	cd src

	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --with-mcrypt --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-calendar --enable-soap --with-gettext --disable-fileinfo --enable-opcache --enable-intl
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make ZEND_EXTRA_LIBS='-liconv' -j${cpuCore}
	/etc/init.d/php-fpm-56 stop
	sleep 1
	make install
	sleep 1
	rm -rf ${php_update_path}
	Ln_PHP_Bin
	/etc/init.d/php-fpm-56 start
	echo "${php_56}" > ${php_setup_path}/version.pl
	rm -f ${php_setup_path}/version_check.pl
}
Update_PHP_70()
{
	cd ${run_path}
	php_version="70"
	php_setup_path=${php_path}/${php_version}
	php_update_path=${php_path}/${php_version}/update

	mkdir -p ${php_update_path}
	rm -rf ${php_update_path}/*

	cd ${php_update_path}
	if [ ! -f "${php_update_path}/src.tar.gz" ];then
		wget -O ${php_update_path}/src.tar.gz http://www.php.net/distributions/php-${php_70}.tar.gz -T20
	fi
	tar zxf src.tar.gz
	mv php-${php_70} src
	cd src

	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --with-mcrypt --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-calendar --enable-soap --with-gettext --disable-fileinfo --enable-opcache
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make ZEND_EXTRA_LIBS='-liconv' -j${cpuCore}
	/etc/init.d/php-fpm-70 stop
	sleep 1
	make install
	rm -rf ${php_update_path}
	sleep 1
	Ln_PHP_Bin
	/etc/init.d/php-fpm-70 start
	echo "${php_70}" > ${php_setup_path}/version.pl
	rm -f ${php_setup_path}/version_check.pl
}
Update_PHP_71()
{
	cd ${run_path}
	php_version="71"
	php_setup_path=${php_path}/${php_version}
	php_update_path=${php_path}/${php_version}/update

	mkdir -p ${php_update_path}
	rm -rf ${php_update_path}/*

	cd ${php_update_path}
	if [ ! -f "${php_update_path}/src.tar.gz" ];then
		wget -O ${php_update_path}/src.tar.gz http://www.php.net/distributions/php-${php_71}.tar.gz -T20
	fi
	tar zxf src.tar.gz
	mv php-${php_71} src
	cd src

	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --with-mcrypt --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-calendar --enable-soap --with-gettext --disable-fileinfo --enable-opcache
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make ZEND_EXTRA_LIBS='-liconv' -j${cpuCore}
	/etc/init.d/php-fpm-71 stop
	sleep 1
	make install
	sleep 1
	rm -rf ${php_update_path}
	Ln_PHP_Bin
	/etc/init.d/php-fpm-71 start
	echo "${php_71}" > ${php_setup_path}/version.pl
	rm -f ${php_setup_path}/version_check.pl
}
Update_PHP_72()
{
	cd ${run_path}
	php_version="72"
	php_setup_path=${php_path}/${php_version}
	php_update_path=${php_path}/${php_version}/update

	mkdir -p ${php_update_path}
	rm -rf ${php_update_path}/*

	cd ${php_update_path}
	if [ ! -f "${php_update_path}/src.tar.gz" ];then
		wget -O ${php_update_path}/src.tar.gz http://www.php.net/distributions/php-${php_72}.tar.gz -T20
	fi
	tar zxf src.tar.gz
	mv php-${php_72} src
	cd src
	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --enable-ftp --with-gd --enable-gd-native-ttf --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-calendar --enable-soap --with-gettext --disable-fileinfo --enable-opcache
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make ZEND_EXTRA_LIBS='-liconv' -j${cpuCore}
	/etc/init.d/php-fpm-72 stop
	sleep 1
	make install
	sleep 1
	rm -rf ${php_update_path}
	Ln_PHP_Bin
	/etc/init.d/php-fpm-72 start
	echo "${php_72}" > ${php_setup_path}/version.pl
	rm -f ${php_setup_path}/version_check.pl
}
Update_PHP_73()
{
	cd ${run_path}
	php_version="73"
	php_setup_path=${php_path}/${php_version}
	php_update_path=${php_path}/${php_version}/update

	mkdir -p ${php_update_path}
	rm -rf ${php_update_path}/*

	cd ${php_update_path}
	if [ ! -f "${php_update_path}/src.tar.gz" ];then
		wget -O ${php_update_path}/src.tar.gz http://www.php.net/distributions/php-${php_73}.tar.gz -T20
	fi
	tar zxf src.tar.gz
	mv php-${php_73} src
	cd src

	if [ -f "/usr/local/curl2/bin/curl" ]; then
		withOpenssl="/usr/local/curl2"
	else
		withOpenssl="/usr/local/curl"
	fi

	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --enable-fpm --with-fpm-user=www --with-fpm-group=www --enable-mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=${withOpenssl} --enable-mbregex --enable-mbstring --enable-intl --enable-pcntl --enable-ftp --with-gd --with-openssl=/usr/local/openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc  --enable-soap --with-gettext --disable-fileinfo --enable-opcache --enable-zip --enable-calendar --without-libzip
	if [ "${Is_64bit}" = "32" ];then
		sed -i 's/lcrypt$/lcrypt -lresolv/' Makefile
	fi
	make ZEND_EXTRA_LIBS='-liconv' -j${cpuCore}
	/etc/init.d/php-fpm-73 stop
	sleep 1
	make install
	sleep 1
	rm -rf ${php_update_path}
	Ln_PHP_Bin
	sed -i "/zip.so/d"  ${php_setup_path}/etc/php.ini
	/etc/init.d/php-fpm-73 start
	echo "${php_73}" > ${php_setup_path}/version.pl
	rm -f ${php_setup_path}/version_check.pl
}
SetPHPMyAdmin()
{
	if [ -f "/opt/slemp/server/nginx/sbin/nginx" ]; then
		webserver="nginx"
	fi
	PHPVersion=""
	for phpV in 56 70 71 72 73
	do
		if [ -f "/opt/slemp/server/php/${phpV}/bin/php" ]; then
			PHPVersion=${phpV}
		fi
	done

	[ -z "${PHPVersion}" ] && PHPVersion="00"
	if [ "${webserver}" == "nginx" ];then
		sed -i "s#$Root_Path/wwwroot/default#$Root_Path/server/phpmyadmin#" $Root_Path/server/nginx/conf/nginx.conf
		rm -f $Root_Path/server/nginx/conf/enable-php.conf
		\cp $Root_Path/server/nginx/conf/enable-php-$PHPVersion.conf $Root_Path/server/nginx/conf/enable-php.conf
		sed -i "/pathinfo/d" $Root_Path/server/nginx/conf/enable-php.conf
		/etc/init.d/nginx reload
	else
		sed -i "s#$Root_Path/wwwroot/default#$Root_Path/server/phpmyadmin#" $Root_Path/server/apache/conf/extra/httpd-vhosts.conf
		sed -i "0,/php-cgi/ s/php-cgi-\w*\.sock/php-cgi-${PHPVersion}.sock/" $Root_Path/server/apache/conf/extra/httpd-vhosts.conf
		/etc/init.d/httpd reload
	fi
}

Uninstall_PHP()
{
	php_version=${1/./}

	service php-fpm-$php_version stop

	Service_Del

	rm -rf $php_path/$php_version
	rm -f /etc/init.d/php-fpm-$php_version

	if [ -f "$Root_Path/server/phpmyadmin/version.pl" ];then
		SetPHPMyAdmin
	fi

	for phpV in 56 70 71 72 73
	do
		if [ -f "/opt/slemp/server/php/${phpV}/bin/php" ]; then
			rm -f /usr/bin/php
			ln -sf /opt/slemp/server/php/${phpV}/bin/php /usr/bin/php
		fi
	done
}


actionType=$1
version=$2

if [ "$actionType" == 'install' ];then
	Install_Openssl
	Install_Curl
	Install_Icu4c
	case "$version" in
		'5.6')
			Install_PHP_56
			;;
		'7.0')
			Install_PHP_70
			;;
		'7.1')
			Install_PHP_71
			;;
		'7.2')
			Install_PHP_72
			;;
		'7.3')
			Install_PHP_73
			;;
	esac
	armCheck=$(uname -a|grep arm)
	[ "${armCheck}" ] && Uninstall_Zend
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_PHP $version
elif [ "$actionType" == 'update' ];then
	case "$version" in
		'5.6')
			Update_PHP_56
			;;
		'7.0')
			Update_PHP_70
			;;
		'7.1')
			Update_PHP_71
			;;
		'7.2')
			Update_PHP_72
			;;
		'7.3')
			Update_PHP_73
			;;
	esac
fi
