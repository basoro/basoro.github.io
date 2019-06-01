#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
echo "
+----------------------------------------------------------------------
| Bt-WebPanel 2.8 FOR CentOS
+----------------------------------------------------------------------
| Copyright (c) 2015-2016 BT-SOFT(http://www.bt.cn) All rights reserved.
+----------------------------------------------------------------------
| Tengine-2.2.0/Nginx1.8-1.10/Apache2.4/MySQL5.5-5.7/PHP5.2-7.0
+----------------------------------------------------------------------
| Thanks to Lnmp.org
+----------------------------------------------------------------------
"
#判断是否已经执行安装
if [ -f "/tmp/bt_lock.pl" ];then
	echo 'Already in the installation of BT-Panel,Please remove /tmp/bt_lock.pl';
	exit
fi

php_path="/www/server/php"
php_setup_path="/www/server/php"
mysql_dir="/www/server/mysql"
mysql_config="${mysql_dir}/bin/mysql_config"


run_path="/root"
cd ${run_path}
#准备下载节点
echo '=============================================='
echo '1) CHINA - Hong Kong'
echo '2) CHINA - Guangdong'
echo '3) U.S.A - Los Angeles'
read -p 'Please select download node (1): ' isUrl;

case "${isUrl}" in
	'1')
		Download_Url=http://103.224.251.67:5880
		;;
	 '2')
	 	Download_Url=http://125.88.182.172:5880
	 	;;
	 '3')
		Download_Url=http://128.1.164.196:5880
	 ;;
	*)
		Download_Url=http://103.224.251.67:5880
		;;
esac

#确认Centos版本

#版本
curl_version='7.50.3'
nginx_version='1.10.2'
apache_24_version='2.4.25'
php_55='5.5.38'
php_56='5.6.27'
php_70='7.0.12'
mysql_55='5.5.53'
mysql_56='5.6.34'
mysql_57='5.7.16'
Is_64bit=`getconf LONG_BIT`

centos_version=`cat /etc/redhat-release | grep ' 7.' | grep -i centos`
if [ "${centos_version}" != '' ]; then
	rpm_path="centos7"
else
	rpm_path="centos6"
fi

#检查当前环境
CheckInstall()
{
	if [ -f "/usr/bin/mysql" ];then
		echo 'Has been installed MySQL!'
		rm -f /tmp/bt_lock.pl
		exit
	fi
	if [ -f "/etc/init.d/nginx" ];then
		echo 'Has been installed Nginx!'
		rm -f /tmp/bt_lock.pl
		exit
	fi
	if [ -f "/etc/init.d/httpd" ];then
		echo 'Has been installed Apache!'
		rm -f /tmp/bt_lock.pl
		exit
	fi
}

CheckDisk()
{
	mypath=`df | grep '/www'`
	if [ "${mypath}" == '' ];then
		isLeft=`df | grep /$ | awk '{print $4}' | grep %`
		if [ "${isLeft}" == '' ];then
			diskC=`df | grep /$ | awk '{print $4}'`
		else
			diskC=`df | grep /$ | awk '{print $3}'`
		fi
	else
		diskC=`df | grep /www$ | awk '{print $4}'`
	fi

	if [ $diskC -lt 4242880 ] && [ $diskC -gt 0 ];then
		#echo '错误: 磁盘剩余空间小于4GB,无法安装!'
		echo 'Disk space is less than 4GB, can not be installed!'
		rm -f /tmp/bt_lock.pl
		exit;
	fi

	if [ ! -d "/www" ];then
		mkdir -p /www
	fi
}

Install_SendMail()
{
	yum -y install sendmail mailx
}


Export_PHP_Autoconf()
{
    export PHP_AUTOCONF=/usr/local/autoconf-2.13/bin/autoconf
    export PHP_AUTOHEADER=/usr/local/autoconf-2.13/bin/autoheader
}

Ln_PHP_Bin()
{
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
	echo 'not install composer';
}


Install_Autoconf()
{
	cd ${run_path}
	if [ ! -f "autoconf-2.13.tar.gz" ];then
		wget ${Download_Url}/src/autoconf-2.13.tar.gz
	fi
	tar zxf autoconf-2.13.tar.gz
	cd autoconf-2.13
    ./configure --prefix=/usr/local/autoconf-2.13
    make && make install
    cd ${run_path}
    rm -rf autoconf-2.13
	rm -f autoconf-2.13.tar.gz
}

Install_Libiconv()
{
	if [ -d '/usr/local/libiconv' ];then
		return
	fi
	cd ${run_path}
	if [ ! -f "libiconv-1.14.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/libiconv-1.14.rpm
	fi
	rpm -ivh libiconv-1.14.rpm --force --nodeps
	rm -f libiconv-1.14.rpm
}

Install_Libmcrypt()
{
	cd ${run_path}
	if [ ! -f "libmcrypt-2.5.8.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/libmcrypt-2.5.8.rpm
	fi

	rpm -ivh libmcrypt-2.5.8.rpm --force --nodeps
	rm -f libmcrypt-2.5.8.rpm
}

Install_Mcrypt()
{
	cd ${run_path}
	if [ ! -f "mcrypt-2.6.8.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/mcrypt-2.6.8.rpm 
	fi
	
	rpm -ivh mcrypt-2.6.8.rpm --force --nodeps 
	rm -f mcrypt-2.6.8.rpm

}

Install_Mhash()
{
	cd ${run_path}
	if [ ! -f "mhash-0.9.9.9.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/mhash-0.9.9.9.rpm
	fi
	rpm -ivh mhash-0.9.9.9.rpm --force --nodeps
	rm -f mhash-0.9.9.9.rpm
}

Install_Freetype()
{
	cd ${run_path}
	if [ ! -f "freetype-2.4.12.tar.gz" ];then
		wget ${Download_Url}/src/freetype-2.4.12.tar.gz -T20
	fi
	tar zxf freetype-2.4.12.tar.gz
	cd freetype-2.4.12
    ./configure --prefix=/usr/local/freetype
    make && make install

    cat > /etc/ld.so.conf.d/freetype.conf<<EOF
/usr/local/freetype/lib
EOF
    ldconfig
    ln -sf /usr/local/freetype/include/freetype2 /usr/local/include
    ln -sf /usr/local/freetype/include/ft2build.h /usr/local/include
    cd ${run_path}
    rm -rf freetype-2.4.12
	rm -f freetype-2.4.12.tar.gz
}

Install_Curl()
{	
	cd ${run_path}
	if [ ! -f "curl-7.50.3.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/curl-7.50.3.rpm
	fi
	rpm -ivh curl-7.50.3.rpm --force --nodeps
	rm -f curl-7.50.3.rpm
}

Install_Pcre()
{
    Cur_Pcre_Ver=`pcre-config --version`
    if echo "${Cur_Pcre_Ver}" | grep -vEqi '^8.';then
		cd ${run_path}
		if [ ! -f "pcre-8.36.rpm" ];then
			wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/pcre-8.36.rpm
		fi
		rpm -ivh pcre-8.36.rpm --force --nodeps
		rm -f pcre-8.36.rpm
    fi
}

Set_PHP_FPM_Opt()
{
    if [[ ${MemTotal} -gt 1024 && ${MemTotal} -le 2048 ]]; then
        sed -i "s#pm.max_children.*#pm.max_children = 30#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.start_servers.*#pm.start_servers = 15#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 15#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 30#" ${php_setup_path}/etc/php-fpm.conf
    elif [[ ${MemTotal} -gt 2048 && ${MemTotal} -le 4096 ]]; then
        sed -i "s#pm.max_children.*#pm.max_children = 50#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.start_servers.*#pm.start_servers = 30#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 30#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 50#" ${php_setup_path}/etc/php-fpm.conf
    elif [[ ${MemTotal} -gt 4096 && ${MemTotal} -le 8192 ]]; then
        sed -i "s#pm.max_children.*#pm.max_children = 80#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.start_servers.*#pm.start_servers = 40#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 40#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 80#" ${php_setup_path}/etc/php-fpm.conf
    elif [[ ${MemTotal} -gt 8192 ]]; then
        sed -i "s#pm.max_children.*#pm.max_children = 100#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.start_servers.*#pm.start_servers = 60#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.min_spare_servers.*#pm.min_spare_servers = 60#" ${php_setup_path}/etc/php-fpm.conf
        sed -i "s#pm.max_spare_servers.*#pm.max_spare_servers = 100#" ${php_setup_path}/etc/php-fpm.conf
    fi
}

Install_PHP_52()
{
	if [ "${apacheVersion}" == "${apache_24_version}" ];then
		rm -rf /www/server/php/52
		return;
	fi
	cd ${run_path}
	php_version="52"
	php_setup_path=${php_path}/${php_version}
    Export_PHP_Autoconf
	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/php-5.2.17.rpm" ];then
		wget  ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/php-5.2.17.rpm
	fi
	ln -s /usr/lib64/libjpeg.so /usr/lib/libjpeg.so
	ln -s /usr/lib64/libpng.so /usr/lib/libpng.so
	rpm -ivh php-5.2.17.rpm --force --nodeps
	rm -f php-5.2.17.rpm
	# else
	# 	./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --with-apxs2=/www/server/apache/bin/apxs --with-mysql=${mysql_dir} --with-pdo-mysql=${mysql_dir} --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --enable-discard-path --enable-magic-quotes --enable-safe-mode --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --with-mcrypt --with-gd --enable-gd-native-ttf --with-openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-soap --with-gettext --with-mime-magic
	# fi
	# make ZEND_EXTRA_LIBS='-liconv'
    #    make install
	
	
    mkdir -p ${php_setup_path}/etc
    wget http://103.224.251.79:5671/rpm/php.ini-dist
    \cp php.ini-dist ${php_setup_path}/etc/php.ini
	
	#安装mysqli
	mkdir -p ${php_setup_path}/src
	cd ${php_setup_path}/src
	wget http://103.224.251.79:5671/rpm/src/ext.tar.gz
	tar zxvf ext.tar.gz
	sed -i "s@memset(&tm, sizeof(tm), 0)@memset(&tm, 0, sizeof(tm))@" ext/zip/lib/zip_dirent.c
	rm -f ext.tar.gz
	cd ext/mysqli/
	/www/server/php/52/bin/phpize
	./configure --with-php-config=/www/server/php/52/bin/php-config  --with-mysqli=/www/server/mysql/bin/mysql_config
	make
	make install
	cd ${php_setup_path}

    Ln_PHP_Bin

    # php extensions
    sed -i 's#extension_dir = "./"#extension_dir = "${php_setup_path}/lib/php/extensions/no-debug-non-zts-20060613/"\n#' ${php_setup_path}/etc/php.ini
    sed -i 's#output_buffering =.*#output_buffering = On#' ${php_setup_path}/etc/php.ini
    sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
    sed -i 's/short_open_tag =.*/short_open_tag = On/g' ${php_setup_path}/etc/php.ini
    sed -i 's/; cgi.fix_pathinfo=.*/cgi.fix_pathinfo=0/g'${php_setup_path}/etc/php.ini
    sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
    sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
    Pear_Pecl_Set
    
	mkdir -p /usr/local/zend/php52
    if [ "${Is_64bit}" == "64" ] ; then
        wget http://125.88.182.172:5880/src/ZendOptimizer-3.3.9-linux-glibc23-x86_64.tar.gz -T20
        tar zxf ZendOptimizer-3.3.9-linux-glibc23-x86_64.tar.gz

        \cp ZendOptimizer-3.3.9-linux-glibc23-x86_64/data/5_2_x_comp/ZendOptimizer.so /usr/local/zend/php52/
		rm -rf ZendOptimizer-3.3.9-linux-glibc23-x86_64
		rm -f ZendOptimizer-3.3.9-linux-glibc23-x86_64.tar.gz
    else
        wget ${Download_Url}/src/ZendOptimizer-3.3.9-linux-glibc23-i386.tar.gz -T20
        tar zxf ZendOptimizer-3.3.9-linux-glibc23-i386.tar.gz
        \cp ZendOptimizer-3.3.9-linux-glibc23-i386/data/5_2_x_comp/ZendOptimizer.so /usr/local/zend/php52/
		rm -rf ZendOptimizer-3.3.9-linux-glibc23-i386
		rm -f ZendOptimizer-3.3.9-linux-glibc23-i386.tar.gz
    fi

    cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

[Zend Optimizer]
zend_optimizer.optimization_level=1
zend_extension="/usr/local/zend/php52/ZendOptimizer.so"

;xcache

EOF

	if [ "${apacheVersion}" != '2.2.31' ];then
		rm -f ${php_setup_path}/etc/php-fpm.conf
		wget -O ${php_setup_path}/etc/php-fpm.conf ${Download_Url}/conf/php-fpm5.2.conf -T20
		wget -O /etc/init.d/php-fpm-52 ${Download_Url}/init/php_fpm_52.init -T20
		chmod +x /etc/init.d/php-fpm-52
		chkconfig --add php-fpm-52
		chkconfig --level 2345 php-fpm-52 off
		service php-fpm-52 start
	fi
	rm -f ${php_setup_path}/src.tar.gz
	
	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-5.2 installation failed.\033[0m";
		exit 0;
	fi
	
}

Install_PHP_53()
{
	cd ${run_path}
	php_version="53"
	php_setup_path=${php_path}/${php_version}
	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/php-5.3.29.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/php-5.3.29.rpm
	fi
  
	if [ "${apacheVersion}" != '2.2.31' ];then
		rpm -ivh php-5.3.29.rpm --force --nodeps
		rm -f php-5.3.29 --force --nodeps
	else
		./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --with-apxs2=/www/server/apache/bin/apxs --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-magic-quotes --enable-safe-mode --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --with-mcrypt --with-gd --enable-gd-native-ttf --with-openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-soap --with-gettext --disable-fileinfo
	fi
	make ZEND_EXTRA_LIBS='-liconv'
    make install

    Ln_PHP_Bin

    echo "Copy new php configure file..."
    mkdir -p ${php_setup_path}/etc
    \cp php.ini-production ${php_setup_path}/etc/php.ini
	
	cd ${run_path}
    # php extensions
    echo "Modify php.ini......"
    sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
    sed -i 's/short_open_tag =.*/short_open_tag = On/g'${php_setup_path}/etc/php.ini
    sed -i 's/;cgi.fix_pathinfo=.*/cgi.fix_pathinfo=0/g' ${php_setup_path}/etc/php.ini
    sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
    sed -i 's/register_long_arrays =.*/;register_long_arrays = On/g' ${php_setup_path}/etc/php.ini
    sed -i 's/magic_quotes_gpc =.*/;magic_quotes_gpc = On/g' ${php_setup_path}/etc/php.ini
    sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
    Pear_Pecl_Set
    Install_Composer

    echo "Install ZendGuardLoader for PHP 5.3..."
	mkdir -p /usr/local/zend/php53
    if [ "${Is_64bit}" == "64" ] ; then
        wget ${Download_Url}/src/ZendGuardLoader-php-5.3-linux-glibc23-x86_64.tar.gz
        tar zxf ZendGuardLoader-php-5.3-linux-glibc23-x86_64.tar.gz
        \cp ZendGuardLoader-php-5.3-linux-glibc23-x86_64/php-5.3.x/ZendGuardLoader.so /usr/local/zend/php53/
		rm -f ${run_path}/ZendGuardLoader-php-5.3-linux-glibc23-x86_64.tar.gz
		rm -rf ${run_path}/ZendGuardLoader-php-5.3-linux-glibc23-x86_64
    else
        wget ${Download_Url}/src/ZendGuardLoader-php-5.3-linux-glibc23-i386.tar.gz
        tar zxf ZendGuardLoader-php-5.3-linux-glibc23-i386.tar.gz
        \cp ZendGuardLoader-php-5.3-linux-glibc23-i386/php-5.3.x/ZendGuardLoader.so /usr/local/zend/php53/
		rm -rf ZendGuardLoader-php-5.3-linux-glibc23-i386
		rm -f ZendGuardLoader-php-5.3-linux-glibc23-i386.tar.gz
    fi
	

    echo "Write ZendGuardLoader to php.ini..."
    cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

;opcache

[Zend ZendGuard Loader]
zend_extension=/usr/local/zend/php53/ZendGuardLoader.so
zend_loader.enable=1
zend_loader.disable_licensing=0
zend_loader.obfuscation_level_support=3
zend_loader.license_path=

;xcache

EOF
if [ "${apacheVersion}" != '2.2.31' ];then
    cat >${php_setup_path}/etc/php-fpm.conf<<EOF
[global]
pid = ${php_setup_path}/var/run/php-fpm.pid
error_log = ${php_setup_path}/var/log/php-fpm.log
log_level = notice

[www]
listen = /tmp/php-cgi-53.sock
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
listen.owner = www
listen.group = www
listen.mode = 0666
user = www
group = www
pm = dynamic
pm.status_path = /phpfpm_53_status
pm.max_children = 20
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 6
request_terminate_timeout = 100
request_slowlog_timeout = 30
slowlog = var/log/slow.log
EOF
Set_PHP_FPM_Opt
	
    \cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-53
	chmod +x /etc/init.d/php-fpm-53
	
	chkconfig --add php-fpm-53
	chkconfig --level 2345 php-fpm-53 off
	service php-fpm-53 start
fi
	rm -f ${php_setup_path}src.tar.gz
	
	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-5.3 installation failed.\033[0m";
		exit 0;
	fi
}


Install_PHP_54()
{
	cd ${run_path}
	php_version="54"
	php_setup_path=${php_path}/${php_version}
	
	mkdir -p ${php_setup_path}
    rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/php-5.4.45.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/php-5.4.45.rpm
	fi

	if [ "${apacheVersion}" != '2.2.31' ];then
		rpm -ivh php-5.4.45.rpm --force --nodeps
		rm -f php-5.4.45.rpm --force --nodeps
	else
		./configure --prefix=${php_setup_path} --with-config-file-path=${php_setup_path}/etc --with-apxs2=/www/server/apache/bin/apxs --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd --with-iconv-dir --with-freetype-dir=/usr/local/freetype --with-jpeg-dir --with-png-dir --with-zlib --with-libxml-dir=/usr --enable-xml --disable-rpath --enable-bcmath --enable-shmop --enable-sysvsem --enable-inline-optimization --with-curl=/usr/local/curl --enable-mbregex --enable-mbstring --with-mcrypt --with-gd --enable-gd-native-ttf --with-openssl --with-mhash --enable-pcntl --enable-sockets --with-xmlrpc --enable-zip --enable-soap --with-gettext --disable-fileinfo --enable-intl --with-xsl
	fi
    Ln_PHP_Bin

    mkdir -p ${php_setup_path}/etc
    \cp php.ini-production ${php_setup_path}/etc/php.ini
	cd ${php_setup_path}
    # php extensions
    sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
    sed -i 's/short_open_tag =.*/short_open_tag = On/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;cgi.fix_pathinfo=.*/cgi.fix_pathinfo=0/g' ${php_setup_path}/etc/php.ini
    sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
    sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
    Pear_Pecl_Set
    Install_Composer
	
	mkdir -p /usr/local/zend/php54
    if [ "${Is_64bit}" == "64" ] ; then
        wget ${Download_Url}/src/ZendGuardLoader-70429-PHP-5.4-linux-glibc23-x86_64.tar.gz -T20
        tar zxf ZendGuardLoader-70429-PHP-5.4-linux-glibc23-x86_64.tar.gz
        \cp ZendGuardLoader-70429-PHP-5.4-linux-glibc23-x86_64/php-5.4.x/ZendGuardLoader.so /usr/local/zend/php54/
		rm -rf ZendGuardLoader-70429-PHP-5.4-linux-glibc23-x86_64
		rm -f ZendGuardLoader-70429-PHP-5.4-linux-glibc23-x86_64.tar.gz
    else
        wget ${Download_Url}/src/ZendGuardLoader-70429-PHP-5.4-linux-glibc23-i386.tar.gz -T20
        tar zxf ZendGuardLoader-70429-PHP-5.4-linux-glibc23-i386.tar.gz
        \cp ZendGuardLoader-70429-PHP-5.4-linux-glibc23-i386/php-5.4.x/ZendGuardLoader.so /usr/local/zend/php54/
		rm -rf ZendGuardLoader-70429-PHP-5.4-linux-glibc23-i386
		rm -f ZendGuardLoader-70429-PHP-5.4-linux-glibc23-i386.tar.gz
    fi

    echo "Write ZendGuardLoader to php.ini..."
    cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

;opcache

[Zend ZendGuard Loader]
zend_extension=/usr/local/zend/php54/ZendGuardLoader.so
zend_loader.enable=1
zend_loader.disable_licensing=0
zend_loader.obfuscation_level_support=3
zend_loader.license_path=

;xcache

EOF

if [ "${apacheVersion}" != '2.2.31' ];then
    cat >${php_setup_path}/etc/php-fpm.conf<<EOF
[global]
pid = ${php_setup_path}/var/run/php-fpm.pid
error_log = ${php_setup_path}/var/log/php-fpm.log
log_level = notice

[www]
listen = /tmp/php-cgi-54.sock
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
listen.owner = www
listen.group = www
listen.mode = 0666
user = www
group = www
pm = dynamic
pm.status_path = /phpfpm_54_status
pm.max_children = 20
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 6
request_terminate_timeout = 100
request_slowlog_timeout = 30
slowlog = var/log/slow.log
EOF
	Set_PHP_FPM_Opt
    \cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-54
    chmod +x /etc/init.d/php-fpm-54
	
	chkconfig --add php-fpm-54
	chkconfig --level 2345 php-fpm-54 off
	rm -f /tmp/php-cgi-54.sock
	service php-fpm-54 start
fi
	rm -f ${php_setup_path}/src.tar.gz
	
	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-5.4 installation failed.\033[0m";
		exit 0;
	fi
	
}

Install_PHP_55()
{
	cd ${run_path}
	php_version="55"
	php_setup_path=${php_path}/${php_version}
	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/php-5.5.38.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/php-5.5.38.rpm
	fi

		
	rpm -ivh php-5.5.38.rpm --force --nodeps
	rm -f php-5.5.38.rpm

    Ln_PHP_Bin

    echo "Copy new php configure file..."
    mkdir -p ${php_setup_path}/etc
    \cp php.ini-production ${php_setup_path}/etc/php.ini


	wget -O ${php_setup_path}/etc/php.ini ${Download_Url}/install/conf/php-55.ini

    cd ${php_setup_path}
    # php extensions
    echo "Modify php.ini..."
    sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
    sed -i 's/short_open_tag =.*/short_open_tag = On/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;cgi.fix_pathinfo=.*/cgi.fix_pathinfo=0/g' ${php_setup_path}/etc/php.ini
    sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
    sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
    Pear_Pecl_Set
    Install_Composer

    echo "Install ZendGuardLoader for PHP 5.5..."
    mkdir -p /usr/local/zend/php55
    if [ "${Is_64bit}" == "64" ] ; then
        wget ${Download_Url}/src/zend-loader-php5.5-linux-x86_64.tar.gz -T20
        tar zxf zend-loader-php5.5-linux-x86_64.tar.gz
        mkdir -p /usr/local/zend/
        \cp zend-loader-php5.5-linux-x86_64/ZendGuardLoader.so /usr/local/zend/php55/
		rm -rf zend-loader-php5.5-linux-x86_64
		rm -f zend-loader-php5.5-linux-x86_64.tar.gz
    else
        wget ${Download_Url}/src/zend-loader-php5.5-linux-i386.tar.gz
        tar zxf zend-loader-php5.5-linux-i386.tar.gz
        mkdir -p /usr/local/zend/
        \cp zend-loader-php5.5-linux-i386/ZendGuardLoader.so /usr/local/zend/php55/
		rm -rf zend-loader-php5.5-linux-i386
		rm -f zend-loader-php5.5-linux-i386.tar.gz
    fi

    echo "Write ZendGuardLoader to php.ini..."
    cat >>${php_setup_path}/etc/php.ini<<EOF

;eaccelerator

;ionCube

;opcache

[Zend ZendGuard Loader]
zend_extension=/usr/local/zend/php55/ZendGuardLoader.so
zend_loader.enable=1
zend_loader.disable_licensing=0
zend_loader.obfuscation_level_support=3
zend_loader.license_path=

;xcache

EOF

    cat >${php_setup_path}/etc/php-fpm.conf<<EOF
[global]
pid = ${php_setup_path}/var/run/php-fpm.pid
error_log = ${php_setup_path}/var/log/php-fpm.log
log_level = notice

[www]
listen = /tmp/php-cgi-55.sock
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
listen.owner = www
listen.group = www
listen.mode = 0666
user = www
group = www
pm = dynamic
pm.status_path = /phpfpm_55_status
pm.max_children = 20
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 6
request_terminate_timeout = 100
request_slowlog_timeout = 30
slowlog = var/log/slow.log
EOF
Set_PHP_FPM_Opt
    echo "Copy php-fpm init.d file..."
    \cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-55
    chmod +x /etc/init.d/php-fpm-55
	
	chkconfig --add php-fpm-55
	chkconfig --level 2345 php-fpm-55 off
	service php-fpm-55 start
	rm -f ${php_setup_path}/src.tar.gz
	
	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-5.5 installation failed.\033[0m";
		exit 0;
	fi
}

Install_PHP_56()
{
	cd ${run_path}
	php_version="56"
	php_setup_path=${php_path}/${php_version}
	
	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/php-5.6.30.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/php-5.6.30.rpm
	fi
	rpm -ivh php-5.6.30.rpm --force --nodeps
	rm -f php-5.6.30.rpm

    Ln_PHP_Bin

    echo "Copy new php configure file..."
    mkdir -p ${php_setup_path}/etc
    \cp php.ini-production ${php_setup_path}/etc/php.ini

    cd ${php_setup_path}
    # php extensions
    echo "Modify php.ini......"
    sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
    sed -i 's/short_open_tag =.*/short_open_tag = On/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;cgi.fix_pathinfo=.*/cgi.fix_pathinfo=0/g' ${php_setup_path}/etc/php.ini
    sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
    sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
    Pear_Pecl_Set
    Install_Composer

    echo "Install ZendGuardLoader for PHP 5.6..."
    mkdir -p /usr/local/zend/php56
    if [ "${Is_64bit}" == "64" ] ; then
        wget ${Download_Url}/src/zend-loader-php5.6-linux-x86_64.tar.gz -T20
        tar zxf zend-loader-php5.6-linux-x86_64.tar.gz
        \cp zend-loader-php5.6-linux-x86_64/ZendGuardLoader.so /usr/local/zend/php56/
		rm -rf zend-loader-php5.6-linux-x86_64
		rm -f zend-loader-php5.6-linux-x86_64.tar.gz
    else
        wget ${Download_Url}/src/zend-loader-php5.6-linux-i386.tar.gz -T20
        tar zxf zend-loader-php5.6-linux-i386.tar.gz
        \cp zend-loader-php5.6-linux-i386/ZendGuardLoader.so /usr/local/zend/php56/
		rm -rf zend-loader-php5.6-linux-i386
		rm -f zend-loader-php5.6-linux-i386.tar.gz
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

    cat >${php_setup_path}/etc/php-fpm.conf<<EOF
[global]
pid = ${php_setup_path}/var/run/php-fpm.pid
error_log = ${php_setup_path}/var/log/php-fpm.log
log_level = notice

[www]
listen = /tmp/php-cgi-56.sock
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
listen.owner = www
listen.group = www
listen.mode = 0666
user = www
group = www
pm = dynamic
pm.status_path = /phpfpm_56_status
pm.max_children = 20
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 6
request_terminate_timeout = 100
request_slowlog_timeout = 30
slowlog = var/log/slow.log
EOF
Set_PHP_FPM_Opt
    echo "Copy php-fpm init.d file..."
    \cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-56
    chmod +x /etc/init.d/php-fpm-56
	
	chkconfig --add php-fpm-56
	chkconfig --level 2345 php-fpm-56 off
	service php-fpm-56 start
	rm -f ${php_setup_path}/src.tar.gz
	
	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-5.6 installation failed.\033[0m";
		rm -rf ${php_setup_path}
		exit 0;
	fi
}

Install_PHP_70()
{
	cd ${run_path}
	php_version="70"
	php_setup_path=${php_path}/${php_version}
	
	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/php-7.0.16.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/php-7.0.16.rpm
	fi
	rpm -ivh php-7.0.16.rpm --force --nodeps
	rm -f php-7.0.16.rpm
    Ln_PHP_Bin

    echo "Copy new php configure file..."
    mkdir -p ${php_setup_path}/etc
    \cp php.ini-production ${php_setup_path}/etc/php.ini

    cd ${php_setup_path}
    # php extensions
    echo "Modify php.ini......"
    sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
    sed -i 's/short_open_tag =.*/short_open_tag = On/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;cgi.fix_pathinfo=.*/cgi.fix_pathinfo=0/g' ${php_setup_path}/etc/php.ini
    sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
    sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
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

    cat >${php_setup_path}/etc/php-fpm.conf<<EOF
[global]
pid = ${php_setup_path}/var/run/php-fpm.pid
error_log = ${php_setup_path}/var/log/php-fpm.log
log_level = notice

[www]
listen = /tmp/php-cgi-70.sock
listen.backlog = -1
listen.allowed_clients = 127.0.0.1
listen.owner = www
listen.group = www
listen.mode = 0666
user = www
group = www
pm = dynamic
pm.status_path = /phpfpm_70_status
pm.max_children = 20
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 6
request_terminate_timeout = 100
request_slowlog_timeout = 30
slowlog = var/log/slow.log
EOF
Set_PHP_FPM_Opt
	\cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-70
    chmod +x /etc/init.d/php-fpm-70
	
	chkconfig --add php-fpm-70
	chkconfig --level 2345 php-fpm-70 off
	service php-fpm-70 start
	rm -f ${php_setup_path}/src.tar.gz
	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-7.0 installation failed.\033[0m";
		rm -rf ${php_setup_path}
		exit 0;
	fi
}

Install_PHP_71()
{
	cd ${run_path}
	php_version="71"
	php_setup_path=${php_path}/${php_version}
	
	mkdir -p ${php_setup_path}
	rm -rf ${php_setup_path}/*
	cd ${php_setup_path}
	if [ ! -f "${php_setup_path}/php-7.1.2.rpm" ];then
		wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/php-7.1.2.rpm
	fi
	rpm -ivh php-7.1.2.rpm --force --nodeps
	rm -f php-7.1.2.rpm

    Ln_PHP_Bin

    echo "Copy new php configure file..."
    mkdir -p ${php_setup_path}/etc
    \cp php.ini-production ${php_setup_path}/etc/php.ini

    cd ${php_setup_path}
    # php extensions
    echo "Modify php.ini......"
    sed -i 's/post_max_size =.*/post_max_size = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/upload_max_filesize =.*/upload_max_filesize = 50M/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;date.timezone =.*/date.timezone = PRC/g' ${php_setup_path}/etc/php.ini
    sed -i 's/short_open_tag =.*/short_open_tag = On/g' ${php_setup_path}/etc/php.ini
    sed -i 's/;cgi.fix_pathinfo=.*/cgi.fix_pathinfo=0/g' ${php_setup_path}/etc/php.ini
    sed -i 's/max_execution_time =.*/max_execution_time = 300/g' ${php_setup_path}/etc/php.ini
    sed -i 's/disable_functions =.*/disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,popen,ini_alter,ini_restore,dl,openlog,syslog,readlink,symlink,popepassthru/g' ${php_setup_path}/etc/php.ini
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
Set_PHP_FPM_Opt
	\cp ${php_setup_path}/src/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm-71
    chmod +x /etc/init.d/php-fpm-71
	
	chkconfig --add php-fpm-71
	chkconfig --level 2345 php-fpm-71 off
	service php-fpm-71 start
	if [ -d '/www/server/nginx' ];then
		wget -O /www/server/nginx/conf/enable-php-71.conf ${Download_Url}/conf/enable-php-71.conf -T20
	fi
	if [ ! -f "${php_setup_path}/bin/php" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: php-7.1 installation failed.\033[0m";
		rm -rf ${php_setup_path}
		exit 0;
	fi
}

Install_Nginx()
{
	cd ${run_path}
    Setup_Path="/www/server/nginx"
	Run_User="www"
    groupadd ${Run_User}
    useradd -s /sbin/nologin -g ${Run_User} ${Run_User}
	
	mkdir -p ${Setup_Path}
	rm -rf ${Setup_Path}/*
	cd ${Setup_Path}
	mkdir src
	cd src
	#yum install perl-ExtUtils-Embed -y
	#wget ${Download_Url}/src/pcre-8.36.tar.gz
	#tar zxf pcre-8.36.tar.gz
	if [ "${nginxVersion}" == "${nginx_version}" ];then
		wget ${Download_Url}/src/openssl-1.1.0c.tar.gz -T20
		tar -zxvf openssl-1.1.0c.tar.gz
		if [ ! -f "${Setup_Path}/nginx-1.10.2.rpm" ];then
			wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/nginx-1.10.2.rpm
		fi
		rpm -ivh nginx-1.10.2.rpm --force --nodeps
		rm -f nginx-1.10.2.rpm
    else
    	if [ "${nginxVersion}" == '-Tengine2.2.0' ];then
    		if [ ! -f "${Setup_Path}/tengine-2.2.0.rpm" ];then
    			wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/tengine-2.2.0.rpm
    		fi
    		rpm -ivh tengine-2.2.0.rpm --force --nodeps
    		rm -f tengine-2.2.0.rpm
    	else
    		if [ ! -f "${Setup_Path}/nginx-1.8.1.rpm" ];then
    			wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/nginx-1.8.1.rpm
    		fi
    		rpm -ivh nginx-1.8.1.rpm --force --nodeps
    		rm -f nginx-1.8.1.rpm
    	fi
	fi
    cd ../
	
    ln -sf ${Setup_Path}/sbin/nginx /usr/bin/nginx
    rm -f ${Setup_Path}/conf/nginx.conf

    wget -O ${Setup_Path}/conf/nginx.conf ${Download_Url}/conf/nginx.conf -T20
    wget -O ${Setup_Path}/conf/pathinfo.conf ${Download_Url}/conf/pathinfo.conf -T20
    wget -O ${Setup_Path}/conf/enable-php.conf ${Download_Url}/conf/enable-php.conf -T20
    wget -O ${Setup_Path}/conf/enable-php-52.conf ${Download_Url}/conf/enable-php-52.conf -T20
	wget -O ${Setup_Path}/conf/enable-php-53.conf ${Download_Url}/conf/enable-php-53.conf -T20
	wget -O ${Setup_Path}/conf/enable-php-54.conf ${Download_Url}/conf/enable-php-54.conf -T20
	wget -O ${Setup_Path}/conf/enable-php-55.conf ${Download_Url}/conf/enable-php-55.conf -T20
	wget -O ${Setup_Path}/conf/enable-php-56.conf ${Download_Url}/conf/enable-php-56.conf -T20
	wget -O ${Setup_Path}/conf/enable-php-70.conf ${Download_Url}/conf/enable-php-70.conf -T20
	wget -O ${Setup_Path}/conf/enable-php-71.conf ${Download_Url}/conf/enable-php-71.conf -T20
	ln -s /usr/local/lib/libpcre.so.1 /lib64/
	ln -s /usr/local/lib/libpcre.so.1 /lib/

	Default_Website_Dir='/www/wwwroot/default'
    mkdir -p ${Default_Website_Dir}
    chmod +w ${Default_Website_Dir}
    mkdir -p /www/wwwlogs
    chmod 777 /www/wwwlogs

    chown -R ${Run_User}:${Run_User} ${Default_Website_Dir}
    mkdir -p ${Setup_Path}/conf/vhost

    if [ "${Default_Website_Dir}" != "/www/wwwroot/default" ]; then
        sed -i "s#/www/wwwroot/default#${Default_Website_Dir}#g" ${Setup_Path}/conf/nginx.conf
    fi
	mkdir -p /usr/local/nginx/logs
	mkdir -p /www/server/nginx/conf/rewrite
	wget -O /www/server/nginx/html/index.html ${Download_Url}/error/index.html
    wget -O /etc/init.d/nginx ${Download_Url}/init/nginx.init
    chmod +x /etc/init.d/nginx
	
	chkconfig --add nginx
	chkconfig --level 2345 nginx off
	
	
	cat > /www/server/nginx/conf/vhost/phpfpm_status.conf<<EOF
server {
	listen 80;
	server_name 127.0.0.1;
	location /nginx_status {
		allow 127.0.0.1;
		deny all;
		stub_status on;
		access_log off;
	}
	location /phpfpm_52_status {
		allow 127.0.0.1;
		fastcgi_pass unix:/tmp/php-cgi-52.sock;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME \$fastcgi_script_name;
	}
	location /phpfpm_53_status {
		allow 127.0.0.1;
		fastcgi_pass unix:/tmp/php-cgi-53.sock;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME \$fastcgi_script_name;
	}
	location /phpfpm_54_status {
		allow 127.0.0.1;
		fastcgi_pass unix:/tmp/php-cgi-54.sock;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME \$fastcgi_script_name;
	}
	location /phpfpm_55_status {
		allow 127.0.0.1;
		fastcgi_pass unix:/tmp/php-cgi-55.sock;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME \$fastcgi_script_name;
	}
	location /phpfpm_56_status {
		allow 127.0.0.1;
		fastcgi_pass unix:/tmp/php-cgi-56.sock;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME \$fastcgi_script_name;
	}
	location /phpfpm_70_status {
		allow 127.0.0.1;
		fastcgi_pass unix:/tmp/php-cgi-70.sock;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME \$fastcgi_script_name;
	}
	location /phpfpm_71_status {
		allow 127.0.0.1;
		fastcgi_pass unix:/tmp/php-cgi-71.sock;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME \$fastcgi_script_name;
	}
}
EOF


	cat > /www/server/nginx/conf/vhost/default.conf<<EOF
server {
	listen 80 default_server;
	server_name _;
	root /www/server/nginx/html;
}
EOF

	
	cd ${Setup_Path}
	rm -f src.tar.gz
	service nginx start
	echo "${nginxVersion}" > ${Setup_Path}/version.pl
	if [ ! -f "${Setup_Path}/sbin/nginx" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: nginx-${nginxVersion} installation failed.\033[0m";
		rm -rf ${Setup_Path}
		exit 0;
	fi
}

Install_Apache_24()
{
	cd ${run_path}
    Setup_Path="/www/server/apache"
	Run_User="www"
    groupadd ${Run_User}
    useradd -s /sbin/nologin -g ${Run_User} ${Run_User}
	
	mkdir -p ${Setup_Path}
	rm -rf ${Setup_Path}/*
	rm -f /etc/init.d/httpd
	wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/httpd-2.4.25.rpm
	rpm -ivh httpd-2.4.25.rpm --force --nodeps
	rm -f httpd-2.4.25.rpm


    mv ${Setup_Path}/conf/httpd.conf ${Setup_Path}/conf/httpd.conf.bak
	
	wget -O ${Setup_Path}/conf/httpd.conf ${Download_Url}/conf/httpd24.conf
	wget -O ${Setup_Path}/conf/extra/httpd-vhosts.conf ${Download_Url}/conf/httpd-vhosts.conf
	wget -O ${Setup_Path}/conf/extra/httpd-default.conf ${Download_Url}/conf/httpd-default.conf
	wget -O ${Setup_Path}/conf/extra/mod_remoteip.conf ${Download_Url}/conf/mod_remoteip.conf
	
    mkdir ${Setup_Path}/conf/vhost
	mkdir -p /www/wwwroot/default
	mkdir -p /www/wwwlogs
	chmod -R 755 /www/wwwroot/default
	chown -R www.www /www/wwwroot/default
	
	wget -O /www/server/apache/htdocs/index.html ${Download_Url}/error/index.html -T20
	wget -O /etc/init.d/httpd ${Download_Url}/init/init.d.httpd -T20
    chmod +x /etc/init.d/httpd
	chkconfig --add httpd
	chkconfig --level 2345 httpd off
	cd ${Setup_Path}
	rm -f src.tar.gz
	echo "${apacheVersion}" > ${Setup_Path}/version.pl
	if [ ! -f "${Setup_Path}/bin/httpd" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: apache-${apacheVersion} installation failed.\033[0m";
		rm -rf ${Setup_Path}
		exit 0;
	fi
}

Install_Apache_22()
{
	cd ${run_path}
    Setup_Path="/www/server/apache"
	Run_User="www"
    groupadd ${Run_User}
    useradd -s /sbin/nologin -g ${Run_User} ${Run_User}
    
    mkdir -p ${Setup_Path}
	rm -rf ${Setup_Path}/*
	rm -f /etc/init.d/httpd

	wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/httpd-2.2.31.rpm
	rpm -ivh httpd-2.2.31.rpm --force --nodeps
	rm -f httpd-2.2.31.rpm

    mv ${Setup_Path}/conf/httpd.conf ${Setup_Path}/conf/httpd.conf.bak
	wget -O ${Setup_Path}/conf/httpd.conf ${Download_Url}/conf/httpd22-lamp.conf -T20
	wget -O ${Setup_Path}/conf/extra/httpd-vhosts.conf ${Download_Url}/conf/httpd-vhosts-lamp.conf -T20
	wget -O ${Setup_Path}/conf/extra/httpd-default.conf ${Download_Url}/conf/httpd-default.conf -T20
	wget -O ${Setup_Path}/conf/extra/mod_remoteip.conf ${Download_Url}/conf/mod_remoteip.conf -T20

    sed -i 's/ServerAdmin you@example.com/ServerAdmin '${ServerAdmin}'/g' ${Setup_Path}/conf/httpd.conf
    sed -i 's/webmaster@example.com/'${ServerAdmin}'/g' ${Setup_Path}/conf/extra/httpd-vhosts.conf
    mkdir -p ${Setup_Path}/conf/vhost

    ln -sf /usr/local/lib/libltdl.so.3 /usr/lib/libltdl.so.3
    mkdir ${Setup_Path}/conf/vhost

	wget -O /etc/init.d/httpd ${Download_Url}/init/init.d.httpd -T20
    chmod +x /etc/init.d/httpd
	
	if [ ! -f "${Setup_Path}/bin/httpd" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: apache-${apacheVersion} installation failed.\033[0m";
		rm -rf ${Setup_Path}
		exit 0;
	fi
}

Install_MySQL_55(){
	Close_MySQL
	cd ${run_path}
	#准备安装
	Setup_Path="/www/server/mysql"
	Data_Path="/www/server/data"
	mkdir -p ${Setup_Path}
	rm -rf ${Setup_Path}/*
	cd ${Setup_Path}
	if [ ! -f "${Setup_Path}/src.tar.gz" ];then
		wget -O ${Setup_Path}/src.tar.gz ${Download_Url}/src/mysql-$mysql_55.tar.gz -T20
	fi
	tar -zxvf src.tar.gz
	mv mysql-$mysql_55 src
	cd src
	
	#编译
	rm -f /etc/my.cnf
	cmake -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_READLINE=1 -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1
	make && make install

	#创建用户
	groupadd mysql
	useradd -s /sbin/nologin -M -g mysql mysql

	#写出配置文件
	cat > /etc/my.cnf<<EOF
[client]
#password	= your_password
port		= 3306
socket		= /tmp/mysql.sock

[mysqld]
port		= 3306
socket		= /tmp/mysql.sock
datadir = ${Data_Path}
default_storage_engine = MyISAM
skip-external-locking
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
innodb_data_home_dir = ${Data_Path}
innodb_data_file_path = ibdata1:10M:autoextend
innodb_log_group_home_dir = ${Data_Path}
innodb_buffer_pool_size = 16M
innodb_additional_mem_pool_size = 2M
innodb_log_file_size = 5M
innodb_log_buffer_size = 8M
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

	MySQL_Opt
	#处理数据目录
	if [ -d "${Data_Path}" ]; then
		rm -rf ${Data_Path}/*
		else
			mkdir -p ${Data_Path}
		fi
		chown -R mysql:mysql${Data_Path}
		${Setup_Path}/scripts/mysql_install_db --defaults-file=/etc/my.cnf --basedir=${Setup_Path} --datadir=${Data_Path} --user=mysql
		chgrp -R mysql ${Setup_Path}/.
		\cp support-files/mysql.server /etc/init.d/mysqld
		chmod 755 /etc/init.d/mysqld

		cat > /etc/ld.so.conf.d/mysql.conf<<EOF
${Setup_Path}/lib
/usr/local/lib
EOF

	

	#启动服务
    ldconfig
	#chown mysql:mysql /etc/my.cnf
    ln -sf ${Setup_Path}/lib/mysql /usr/lib/mysql
    ln -sf ${Setup_Path}/include/mysql /usr/include/mysql
	/etc/init.d/mysqld start
	
	#设置软链
    ln -sf ${Setup_Path}/bin/mysql /usr/bin/mysql
    ln -sf ${Setup_Path}/bin/mysqldump /usr/bin/mysqldump
    ln -sf ${Setup_Path}/bin/myisamchk /usr/bin/myisamchk
    ln -sf ${Setup_Path}/bin/mysqld_safe /usr/bin/mysqld_safe
    ln -sf ${Setup_Path}/bin/mysqlcheck /usr/bin/mysqlcheck

	#设置密码
    ${Setup_Path}/bin/mysqladmin -u root password "${mysqlpwd}"
	
	#添加到服务列表
	chkconfig --add mysqld
	chkconfig --level 2345 mysqld off
	
	cd ${Setup_Path}
	rm -f src.tar.gz
	rm -rf src
	echo "${mysql_55}" > ${Setup_Path}/version.pl
	if [ ! -f "${Setup_Path}/bin/mysqld" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: mysql-5.5 installation failed.\033[0m";
		rm -rf ${Setup_Path}
		exit 0;
	fi
}

MySQL_Opt()
{
	MemTotal=`free -m | grep Mem | awk '{print  $2}'`
    if [[ ${MemTotal} -gt 1024 && ${MemTotal} -lt 2048 ]]; then
        sed -i "s#^key_buffer_size.*#key_buffer_size = 32M#" /etc/my.cnf
        sed -i "s#^table_open_cache.*#table_open_cache = 128#" /etc/my.cnf
        sed -i "s#^sort_buffer_size.*#sort_buffer_size = 768K#" /etc/my.cnf
        sed -i "s#^read_buffer_size.*#read_buffer_size = 768K#" /etc/my.cnf
        sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 8M#" /etc/my.cnf
        sed -i "s#^thread_cache_size.*#thread_cache_size = 16#" /etc/my.cnf
        sed -i "s#^query_cache_size.*#query_cache_size = 16M#" /etc/my.cnf
        sed -i "s#^tmp_table_size.*#tmp_table_size = 32M#" /etc/my.cnf
        sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 128M#" /etc/my.cnf
        sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 32M#" /etc/my.cnf
    elif [[ ${MemTotal} -ge 2048 && ${MemTotal} -lt 4096 ]]; then
        sed -i "s#^key_buffer_size.*#key_buffer_size = 64M#" /etc/my.cnf
        sed -i "s#^table_open_cache.*#table_open_cache = 256#" /etc/my.cnf
        sed -i "s#^sort_buffer_size.*#sort_buffer_size = 1M#" /etc/my.cnf
        sed -i "s#^read_buffer_size.*#read_buffer_size = 1M#" /etc/my.cnf
        sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 16M#" /etc/my.cnf
        sed -i "s#^thread_cache_size.*#thread_cache_size = 32#" /etc/my.cnf
        sed -i "s#^query_cache_size.*#query_cache_size = 32M#" /etc/my.cnf
        sed -i "s#^tmp_table_size.*#tmp_table_size = 64M#" /etc/my.cnf
        sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 256M#" /etc/my.cnf
        sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 64M#" /etc/my.cnf
    elif [[ ${MemTotal} -ge 4096 && ${MemTotal} -lt 8192 ]]; then
        sed -i "s#^key_buffer_size.*#key_buffer_size = 128M#" /etc/my.cnf
        sed -i "s#^table_open_cache.*#table_open_cache = 512#" /etc/my.cnf
        sed -i "s#^sort_buffer_size.*#sort_buffer_size = 2M#" /etc/my.cnf
        sed -i "s#^read_buffer_size.*#read_buffer_size = 2M#" /etc/my.cnf
        sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 32M#" /etc/my.cnf
        sed -i "s#^thread_cache_size.*#thread_cache_size = 64#" /etc/my.cnf
        sed -i "s#^query_cache_size.*#query_cache_size = 64M#" /etc/my.cnf
        sed -i "s#^tmp_table_size.*#tmp_table_size = 64M#" /etc/my.cnf
        sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 512M#" /etc/my.cnf
        sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 128M#" /etc/my.cnf
    elif [[ ${MemTotal} -ge 8192 && ${MemTotal} -lt 16384 ]]; then
        sed -i "s#^key_buffer_size.*#key_buffer_size = 256M#" /etc/my.cnf
        sed -i "s#^table_open_cache.*#table_open_cache = 1024#" /etc/my.cnf
        sed -i "s#^sort_buffer_size.*#sort_buffer_size = 4M#" /etc/my.cnf
        sed -i "s#^read_buffer_size.*#read_buffer_size = 4M#" /etc/my.cnf
        sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 64M#" /etc/my.cnf
        sed -i "s#^thread_cache_size.*#thread_cache_size = 128#" /etc/my.cnf
        sed -i "s#^query_cache_size.*#query_cache_size = 128M#" /etc/my.cnf
        sed -i "s#^tmp_table_size.*#tmp_table_size = 128M#" /etc/my.cnf
        sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 1024M#" /etc/my.cnf
        sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 256M#" /etc/my.cnf
    elif [[ ${MemTotal} -ge 16384 && ${MemTotal} -lt 32768 ]]; then
        sed -i "s#^key_buffer_size.*#key_buffer_size = 512M#" /etc/my.cnf
        sed -i "s#^table_open_cache.*#table_open_cache = 2048#" /etc/my.cnf
        sed -i "s#^sort_buffer_size.*#sort_buffer_size = 8M#" /etc/my.cnf
        sed -i "s#^read_buffer_size.*#read_buffer_size = 8M#" /etc/my.cnf
        sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 128M#" /etc/my.cnf
        sed -i "s#^thread_cache_size.*#thread_cache_size = 256#" /etc/my.cnf
        sed -i "s#^query_cache_size.*#query_cache_size = 256M#" /etc/my.cnf
        sed -i "s#^tmp_table_size.*#tmp_table_size = 256M#" /etc/my.cnf
        sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 2048M#" /etc/my.cnf
        sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 512M#" /etc/my.cnf
    elif [[ ${MemTotal} -ge 32768 ]]; then
        sed -i "s#^key_buffer_size.*#key_buffer_size = 1024M#" /etc/my.cnf
        sed -i "s#^table_open_cache.*#table_open_cache = 4096#" /etc/my.cnf
        sed -i "s#^sort_buffer_size.*#sort_buffer_size = 16M#" /etc/my.cnf
        sed -i "s#^read_buffer_size.*#read_buffer_size = 16M#" /etc/my.cnf
        sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 256M#" /etc/my.cnf
        sed -i "s#^thread_cache_size.*#thread_cache_size = 512#" /etc/my.cnf
        sed -i "s#^query_cache_size.*#query_cache_size = 512M#" /etc/my.cnf
        sed -i "s#^tmp_table_size.*#tmp_table_size = 512M#" /etc/my.cnf
        sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 4096M#" /etc/my.cnf
        sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 1024M#" /etc/my.cnf
    fi
}


Install_MySQL_56()
{
	Close_MySQL
	cd ${run_path}
	#准备安装
	Setup_Path="/www/server/mysql"
	Data_Path="/www/server/data"
	
	rm -f /etc/my.cnf
	mkdir -p ${Setup_Path}
	rm -rf ${Setup_Path}/*
	cd ${Setup_Path}
	if [ ! -f "${Setup_Path}/src.tar.gz" ];then
		wget -O ${Setup_Path}/src.tar.gz ${Download_Url}/src/mysql-$mysql_56.tar.gz -T20
	fi
	tar -zxvf src.tar.gz
	mv mysql-$mysql_56 src
	cd src
	
    
    cmake -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1
    make && make install

    groupadd mysql
    useradd -s /sbin/nologin -M -g mysql mysql

    cat > /etc/my.cnf<<EOF
[client]
#password   = your_password
port        = 3306
socket      = /tmp/mysql.sock

[mysqld]
port        = 3306
socket      = /tmp/mysql.sock
datadir = ${Data_Path}
skip-external-locking
performance_schema_max_table_instances=400
table_definition_cache=400
table_open_cache=256
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

explicit_defaults_for_timestamp = true
#skip-networking
max_connections = 500
max_connect_errors = 100
open_files_limit = 65535

log-bin=mysql-bin
binlog_format=mixed
server-id   = 1
expire_logs_days = 10

#loose-innodb-trx=0
#loose-innodb-locks=0
#loose-innodb-lock-waits=0
#loose-innodb-cmp=0
#loose-innodb-cmp-per-index=0
#loose-innodb-cmp-per-index-reset=0
#loose-innodb-cmp-reset=0
#loose-innodb-cmpmem=0
#loose-innodb-cmpmem-reset=0
#loose-innodb-buffer-page=0
#loose-innodb-buffer-page-lru=0
#loose-innodb-buffer-pool-stats=0
#loose-innodb-metrics=0
#loose-innodb-ft-default-stopword=0
#loose-innodb-ft-inserted=0
#loose-innodb-ft-deleted=0
#loose-innodb-ft-being-deleted=0
#loose-innodb-ft-config=0
#loose-innodb-ft-index-cache=0
#loose-innodb-ft-index-table=0
#loose-innodb-sys-tables=0
#loose-innodb-sys-tablestats=0
#loose-innodb-sys-indexes=0
#loose-innodb-sys-columns=0
#loose-innodb-sys-fields=0
#loose-innodb-sys-foreign=0
#loose-innodb-sys-foreign-cols=0

default_storage_engine = InnoDB
innodb_data_home_dir = ${Data_Path}
innodb_data_file_path = ibdata1:10M:autoextend
innodb_log_group_home_dir = ${Data_Path}
innodb_buffer_pool_size = 16M
innodb_log_file_size = 5M
innodb_log_buffer_size = 8M
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

    
    MySQL_Opt
    if [ -d "${Data_Path}" ]; then
        rm -rf ${Data_Path}/*
    else
        mkdir -p ${Data_Path}
    fi
    #chown -R mysql:mysql ${Data_Path}
    ${Setup_Path}/scripts/mysql_install_db --defaults-file=/etc/my.cnf --basedir=${Setup_Path} --datadir=${Data_Path} --user=mysql
    chgrp -R mysql ${Setup_Path}/.
    \cp support-files/mysql.server /etc/init.d/mysqld
    chmod 755 /etc/init.d/mysqld

    cat > /etc/ld.so.conf.d/mysql.conf<<EOF
    ${Setup_Path}/lib
    /usr/local/lib
EOF
	
	
	#启动服务
    ldconfig
	chown mysql:mysql /etc/my.cnf
    ln -sf ${Setup_Path}/lib/mysql /usr/lib/mysql
    ln -sf ${Setup_Path}/include/mysql /usr/include/mysql
	/etc/init.d/mysqld start
	
	#设置软链
    ln -sf ${Setup_Path}/bin/mysql /usr/bin/mysql
    ln -sf ${Setup_Path}/bin/mysqldump /usr/bin/mysqldump
    ln -sf ${Setup_Path}/bin/myisamchk /usr/bin/myisamchk
    ln -sf ${Setup_Path}/bin/mysqld_safe /usr/bin/mysqld_safe
    ln -sf ${Setup_Path}/bin/mysqlcheck /usr/bin/mysqlcheck
	
	
	#设置密码
    ${Setup_Path}/bin/mysqladmin -u root password "${mysqlpwd}"
	
	#添加到服务列表
	chkconfig --add mysqld
	chkconfig --level 2345 mysqld off
	
	cd ${Setup_Path}
	rm -f src.tar.gz
	rm -rf src
	echo "${mysql_56}" > ${Setup_Path}/version.pl
	
	if [ ! -f "${Setup_Path}/bin/mysqld" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: mysql-5.6 installation failed.\033[0m";
		rm -rf ${Setup_Path}
		exit 0;
	fi
}


Install_MySQL_57()
{
	Close_MySQL
	cd ${run_path}
	#准备安装
	Setup_Path="/www/server/mysql"
	Data_Path="/www/server/data"
	if [ ! -f "boost_1_59_0.tar.gz" ];then
		wget ${Download_Url}/src/boost_1_59_0.tar.gz -T20
	fi
	tar -zxvf boost_1_59_0.tar.gz
	cd boost_1_59_0
	
    ./bootstrap.sh
    ./b2
    ./b2 install
	
	cd ..
    rm -rf boost_1_59_0
	rm -f boost_1_59_0.tar.gz
    rm -f /etc/my.cnf
	
	mkdir -p ${Setup_Path}
	rm -rf ${Setup_Path}/*
	cd ${Setup_Path}
	if [ ! -f "${Setup_Path}/src.tar.gz" ];then
		wget -O ${Setup_Path}/src.tar.gz  ${Download_Url}/src/mysql-$mysql_57.tar.gz -T20
	fi
	tar -zxvf src.tar.gz
	mv mysql-$mysql_57 src
	cd src
	
    cmake -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1
    make && make install

    groupadd mysql
    useradd -s /sbin/nologin -M -g mysql mysql

    cat > /etc/my.cnf<<EOF
[client]
#password   = your_password
port        = 3306
socket      = /tmp/mysql.sock

[mysqld]
port        = 3306
socket      = /tmp/mysql.sock
datadir = ${Data_Path}
skip-external-locking
performance_schema_max_table_instances=400
table_definition_cache=400
table_open_cache=256
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

explicit_defaults_for_timestamp = true
#skip-networking
max_connections = 500
max_connect_errors = 100
open_files_limit = 65535

log-bin=mysql-bin
binlog_format=mixed
server-id   = 1
expire_logs_days = 10
early-plugin-load = ""

#loose-innodb-trx=0
#loose-innodb-locks=0
#loose-innodb-lock-waits=0
#loose-innodb-cmp=0
#loose-innodb-cmp-per-index=0
#loose-innodb-cmp-per-index-reset=0
#loose-innodb-cmp-reset=0
#loose-innodb-cmpmem=0
#loose-innodb-cmpmem-reset=0
#loose-innodb-buffer-page=0
#loose-innodb-buffer-page-lru=0
#loose-innodb-buffer-pool-stats=0
#loose-innodb-metrics=0
#loose-innodb-ft-default-stopword=0
#loose-innodb-ft-inserted=0
#loose-innodb-ft-deleted=0
#loose-innodb-ft-being-deleted=0
#loose-innodb-ft-config=0
#loose-innodb-ft-index-cache=0
#loose-innodb-ft-index-table=0
#loose-innodb-sys-tables=0
#loose-innodb-sys-tablestats=0
#loose-innodb-sys-indexes=0
#loose-innodb-sys-columns=0
#loose-innodb-sys-fields=0
#loose-innodb-sys-foreign=0
#loose-innodb-sys-foreign-cols=0

default_storage_engine = InnoDB
innodb_data_home_dir = ${Data_Path}
innodb_data_file_path = ibdata1:10M:autoextend
innodb_log_group_home_dir = ${Data_Path}
innodb_buffer_pool_size = 16M
innodb_log_file_size = 5M
innodb_log_buffer_size = 8M
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

    MySQL_Opt
    if [ -d "${Data_Path}" ]; then
        rm -rf ${Data_Path}/*
    else
        mkdir -p ${Data_Path}
    fi
    chown -R mysql:mysql ${Data_Path}
    ${Setup_Path}/bin/mysqld --initialize-insecure --basedir=${Setup_Path} --datadir=${Data_Path} --user=mysql
    chgrp -R mysql ${Setup_Path}/.
    \cp support-files/mysql.server /etc/init.d/mysqld
    chmod 755 /etc/init.d/mysqld

    cat > /etc/ld.so.conf.d/mysql.conf<<EOF
    ${Setup_Path}/lib
    /usr/local/lib
EOF


	#启动服务
    ldconfig
    ln -sf ${Setup_Path}/lib/mysql /usr/lib/mysql
    ln -sf ${Setup_Path}/include/mysql /usr/include/mysql
	/etc/init.d/mysqld start
	
	#设置软链
    ln -sf ${Setup_Path}/bin/mysql /usr/bin/mysql
    ln -sf ${Setup_Path}/bin/mysqldump /usr/bin/mysqldump
    ln -sf ${Setup_Path}/bin/myisamchk /usr/bin/myisamchk
    ln -sf ${Setup_Path}/bin/mysqld_safe /usr/bin/mysqld_safe
    ln -sf ${Setup_Path}/bin/mysqlcheck /usr/bin/mysqlcheck

	#设置密码
    ${Setup_Path}/bin/mysqladmin -u root password "${mysqlpwd}"
	
	#添加到服务列表
	chkconfig --add mysqld
	chkconfig --level 2345 mysqld off
	
	cd ${Setup_Path}
	rm -f src.tar.gz
	rm -rf src
	echo "${mysql_57}" > ${Setup_Path}/version.pl
	if [ ! -f "${Setup_Path}/bin/mysqld" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: mysql-5.7 installation failed.\033[0m";
		rm -rf ${Setup_Path}
		exit 0;
	fi
}

Install_MySQL_RPM(){
	Close_MySQL
	cd ${run_path}
	Setup_Path="/www/server/mysql"
	Data_Path="/www/server/data"
	rm -rf /www/server/mysql
	if [ -d "/www/server/data" ];then
		mv /www/server/data /www/server/data_backup_$(date +%Y%m%d)
	fi
	if [ ! -f "mysql-${mysqlVersion}-1.el6.x86_${Is_64bit}.rpm" ];then
		wget ${Download_Url}/rpm/${Is_64bit}/mysql-${mysqlVersion}-1.el6.x86_${Is_64bit}.rpm -T20
	fi
	
	rpm -ivh  mysql-${mysqlVersion}-1.el6.x86_${Is_64bit}.rpm --force --nodeps
	
	rm -f mysql-${mysqlVersion}-1.el6.x86_${Is_64bit}.rpm
	/www/server/mysql/bin/mysql -uroot -proot -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('${mysqlpwd}')";
	/www/server/mysql/bin/mysql -uroot -proot -e "SET PASSWORD FOR 'root'@'127.0.0.1' = PASSWORD('${mysqlpwd}')";
	/www/server/mysql/bin/mysql -uroot -proot -e "flush privileges";
	service mysqld stop;
	rm -f /www/server/data/mysql-*
	rm -f /www/server/data/My*
	rm -f /www/server/data/ib*
	rm -f /etc/my.cnf
if [ "${mysqlVersion}" == '5.5.47' ];then
		cat > /etc/my.cnf<<EOF
[client]
#password	= your_password
port		= 3306
socket		= /tmp/mysql.sock

[mysqld]
port		= 3306
socket		= /tmp/mysql.sock
datadir = ${Data_Path}
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
#innodb_data_home_dir = ${Data_Path}
#innodb_data_file_path = ibdata1:10M:autoextend
#innodb_log_group_home_dir = ${Data_Path}
#innodb_buffer_pool_size = 16M
#innodb_additional_mem_pool_size = 2M
#innodb_log_file_size = 5M
#innodb_log_buffer_size = 8M
#innodb_flush_log_at_trx_commit = 1
#innodb_lock_wait_timeout = 50

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

else
    cat > /etc/my.cnf<<EOF
[client]
#password   = your_password
port        = 3306
socket      = /tmp/mysql.sock

[mysqld]
port        = 3306
socket      = /tmp/mysql.sock
datadir = ${Data_Path}
skip-external-locking
performance_schema_max_table_instances=400
table_definition_cache=400
table_open_cache=256
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

explicit_defaults_for_timestamp = true
#skip-networking
max_connections = 500
max_connect_errors = 100
open_files_limit = 65535

log-bin=mysql-bin
binlog_format=mixed
server-id   = 1
expire_logs_days = 10

#loose-innodb-trx=0
#loose-innodb-locks=0
#loose-innodb-lock-waits=0
#loose-innodb-cmp=0
#loose-innodb-cmp-per-index=0
#loose-innodb-cmp-per-index-reset=0
#loose-innodb-cmp-reset=0
#loose-innodb-cmpmem=0
#loose-innodb-cmpmem-reset=0
#loose-innodb-buffer-page=0
#loose-innodb-buffer-page-lru=0
#loose-innodb-buffer-pool-stats=0
#loose-innodb-metrics=0
#loose-innodb-ft-default-stopword=0
#loose-innodb-ft-inserted=0
#loose-innodb-ft-deleted=0
#loose-innodb-ft-being-deleted=0
#loose-innodb-ft-config=0
#loose-innodb-ft-index-cache=0
#loose-innodb-ft-index-table=0
#loose-innodb-sys-tables=0
#loose-innodb-sys-tablestats=0
#loose-innodb-sys-indexes=0
#loose-innodb-sys-columns=0
#loose-innodb-sys-fields=0
#loose-innodb-sys-foreign=0
#loose-innodb-sys-foreign-cols=0

default_storage_engine = InnoDB
innodb_data_home_dir = ${Data_Path}
innodb_data_file_path = ibdata1:10M:autoextend
innodb_log_group_home_dir = ${Data_Path}
innodb_buffer_pool_size = 16M
innodb_log_file_size = 5M
innodb_log_buffer_size = 8M
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

fi


	MySQL_Opt
	#设置软链
    ln -sf ${Setup_Path}/bin/mysql /usr/bin/mysql
    ln -sf ${Setup_Path}/bin/mysqldump /usr/bin/mysqldump
    ln -sf ${Setup_Path}/bin/myisamchk /usr/bin/myisamchk
    ln -sf ${Setup_Path}/bin/mysqld_safe /usr/bin/mysqld_safe
    ln -sf ${Setup_Path}/bin/mysqlcheck /usr/bin/mysqlcheck
	
	chkconfig --level 2345 mysqld off
	service mysqld start;
	echo "${mysqlVersion}" > ${Setup_Path}/version.pl
	
	if [ ! -f "${Setup_Path}/bin/mysqld" ];then
		echo '========================================================'
		echo -e "\033[31mERROR: mysql-${mysqlVersion} installation failed.\033[0m";
		rm -rf ${Setup_Path}
		exit 0;
	fi
}

Install_Yunclient()
{
	cd ${run_path}
	#安装命令行
	
	yum install glibc.i686 -y
	wget -c $Download_Url/src/zun.init -T20
	mv -f zun.init  /bin/bt
	chmod 755 /bin/bt

	Install_Web

	#安装控制器
	if [ ! -f "cloud.zip" ];then
		wget -c $Download_Url/cloud.zip -T20
	fi
	rm -rf /www/server/cloud
	unzip -o cloud.zip -d /www/server/ > /dev/null 2>&1
	chmod +x /www/server/cloud/yunclient
	chmod +x /www/server/cloud/cloud
	mv -f /www/server/cloud/sock.so /lib/sock.so
	mv -f /www/server/cloud/spec.so /lib/spec.so
	mv -f /www/server/cloud/krnln.so /lib/krnln.so
	mv -f /www/server/cloud/iconv.so /lib/iconv.so
	mv -f /www/server/cloud/dp1.so /lib/dp1.so
	mv -f /www/server/cloud/EThread.so /lib/EThread.so
	if [ ! -f '/lib/EThread.so.so' ];then
		wget -O /lib/EThread.so $Download_Url/EThread.so
	fi
	#service yunclient start
	rm -f cloud.zip
	cloud=""
	echo "phpmyadmin_${phpmyadminExt}" > /www/server/cloud/phpmyadminDirName.pl;
	ip=$(ifconfig -a|awk '/(cast)/ {print $2}'|cut -d':' -f2|head -1);
	
	if [ "${ip}" == '' ];then
		ip=$(ip addr | grep 'inet ' | grep -v '127.0.0.1'|awk '{print $2}'|cut -d/ -f1);
	fi
}

Install_Web()
{
	#安装面板
	if [ ! -f "default.zip" ];then
		wget -c $Download_Url/src/default.zip -T20
	fi
	rm -rf /www/wwwroot/default/*
	unzip -o default.zip -d /www/wwwroot/default/ > /dev/null 2>&1
	rm -f /www/wwwroot/default/index.html
	chown -R www:www /www/wwwroot/default > /dev/null 2>&1
	rm -f default.zip
	if [ ! -f "phpMyAdmin.zip" ];then
		if [ "${vstr}" == '52' ] || [ "${vstr}" == '53' ];then
			wget -O phpMyAdmin.zip $Download_Url/src/phpMyAdmin-4.0.10.15.zip -T20
		else
			wget -O phpMyAdmin.zip $Download_Url/src/phpMyAdmin-4.4.15.6.zip -T20
		fi
	fi
	unzip -o phpMyAdmin.zip -d /www/wwwroot/default/ > /dev/null 2>&1
	dates=`date`;
	pwd=`echo -n $dates|md5sum|cut -d ' ' -f1`;
	dpwd=${pwd:0:12};
	sed -i "s@MYPWD@${dpwd}@" /www/wwwroot/default/conf/sql.config.php
	sed -i "s#\$cfg['blowfish_secret'] = ''#\$cfg['blowfish_secret'] = 'wwwbtcn'#" /www/wwwroot/default/databaseAdmin/config.sample.inc.php
	sed -i "s#\$cfg['blowfish_secret'] = ''#\$cfg['blowfish_secret'] = 'wwwbtcn'#" /www/wwwroot/default/databaseAdmin/libraries/config.default.php
	
	phpmyadminExt=${pwd:10:10};
	
	
	mv /www/wwwroot/default/databaseAdmin /www/wwwroot/default/phpmyadmin_$phpmyadminExt
	
	if [ "${type}" == '' ];then
		if [ -f "/etc/init.d/nginx" ];then
			type='nginx';
		else
			type='apache';
		fi
	fi

	#创建默认数据库
	/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "create database bt_default";
	/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "drop user bt_default@localhost";
	/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "grant select,insert,update,delete,create,drop,alter on bt_default .* to bt_default@localhost identified by '${dpwd}'";
	/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "flush privileges";
	/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} bt_default < /www/wwwroot/default/database.sql;
	/www/server/mysql/bin/mysql -uroot -p${mysqlpwd} -e "update bt_default.bt_config set webserver='${type}' where id=1";
	rm -f /www/wwwroot/default/database.sql;
	rm -f /www/wwwroot/default/index.html;
	rm -f /www/wwwroot/default/tz.php;
	rm -rf /www/wwwroot/default/phpmyadmin;
	cloud=''

	token=${pwd:0:8};
	echo "${token}" > /www/server/token.pl
	userINI='/www/wwwroot/default/.user.ini'
	if [ -f "${userINI}" ];then
		chattr -i $userINI
		rm -f $userINI
	fi
	rm -f phpMyAdmin.zip


	


}

Select_Install()
{
	echo '=======================================================';
	echo "1) Nginx-${nginx_version}[default]";
	echo '2) Nginx-1.8.1';
	echo '3) Tengine-2.2.0';
	echo "4) Apache-${apache_24_version}";
	# echo "5) Apache-${apache_24_version}";
	#echo '请选择网站服务器.';
	read -p "Plese select Web Server(1-4 default:1): " type;
	echo '=======================================================';
	if [ "${type}" != '4' ];then
		echo '1) PHP-5.2';
	fi
	echo '2) PHP-5.3';
	echo '3) PHP-5.4[default]';
	echo '4) PHP-5.5';
	echo '5) PHP-5.6';
	echo '6) PHP-7.0';
	echo '7) PHP-7.1';
	echo -e "\033[32m8) ALL version\033[0m";
	# echo -e "\033[32m8) PHP-5.2/5.3/5.4\033[0m";
	#echo '请选择PHP版本.';
	read -p "Plese select php version(1-8 default:2): " php;
	echo '=======================================================';
	MemTotal=`free -m | grep Mem | awk '{sum+=$2} END {print sum}'`
	echo '1) MySQL 5.5[default]'
    if [ ${MemTotal} -gt 900 ]; then
		echo '2) MySQL 5.6'
	else
		echo -e "\033[31m Memory is less than 1GB, hidden MySQL5.6 installation options. \033[0m";
	fi
	# if [ ${MemTotal} -gt 1800 ]; then
	# 	echo '5) MySQL 5.7'
	# else
	# 	echo -e "\033[31m Memory less than 2GB, hidden MySQL5.7 installation options. \033[0m";
	# fi
	#echo '请选择MySQL版本';
	read -p 'Plese select mysql version(1-5 default:1): ' mysql;
	echo '=======================================================';
	dates=`date`;
	pwd=`echo -n $dates|md5sum|cut -d ' ' -f1`;
	pwd=${pwd:0:16};
	#echo '请输入MySQL管理密码';
	read -p "Plese input mysql admin password (default:$pwd): " mysqlpwd;
	echo '=======================================================';
	case "${type}" in
		'1')
			type='nginx'
			nginxVersion="${nginx_version}"
			;;
		'2')
			type='nginx'
			nginxVersion='1.8.1'
			;;
		'3')
			type='nginx'
			nginxVersion='-Tengine2.2.0'
			;;
		'4')
			type='apache'
			apacheVersion="${apache_24_version}"
			;;
		*)
			type='nginx'
			nginxVersion="${nginx_version}"
	esac
	vphp='';
	case "${mysql}" in
		'1')
			mysql='5.5[RPM]'
			mysqlVersion='5.5.47'
			;;
		'2')
			mysql='5.6[RPM]'
			mysqlVersion='5.6.28'			
			;;
		*)
			mysql='5.5[RPM]'
			mysqlVersion='5.5.47'
	esac
	if [ "${mysqlpwd}" == '' ];then
		mysqlpwd=$pwd
	fi
	main=0
	setupTime='60'
	case "${php}" in
		'1')
			vphp='5.2'
			vstr='52'
			;;
		'2')
			vphp='5.3'
			vstr='53'
			;;
		'3')
			vphp='5.4'
			vstr='54'
			;;
		'4')
			vphp='5.5'
			vstr='55'
			;;
		'5')
			vphp='5.6'
			vstr='56'
			;;
		'6')
			vphp='7.0'
			vstr='70'
			;;
		'7')
			vphp='7.1'
			vstr='71'
			;;
		'8')
			vphp='ALL'
			# setupTime='120'
			vstr='54'
			# main=0
			;;
		# '8')
		# 	vphp='ALL'
		# 	setupTime='90'
		# 	vstr='54'
		# 	main=1
		# 	;;
		*)
			vphp='5.4'
			vstr='54'
	esac

	
	echo '======================================================='
	#echo '您的选择是:'
	echo 'Your selected results to:'
	echo '-------------------------------------------------------'
	#echo '网站服务器'
	echo 'Web Server: '$type$nginxVersion;
	#echo 'PHP版本'   
	echo 'PHP version: '$vphp;
	#echo 'MySQL版本'  
	echo 'MySQL version: '$mysql;
	#echo 'MySQL密码'
	echo 'MySQL Password: '$mysqlpwd;
	echo '-------------------------------------------------------'
	#echo "预计安装耗时: $setupTime 分钟";
	echo "Expected installation: 5 Minute";
	echo '======================================================='
	
	while [ "$go" != 'y' ] && [ "$go" != 'n' ]
	do
		#echo '即将安装到/www ,现在开始安装吗?';
		read -p "About to install /www , Start the installation?(y/n): " go;
	done
	if [ "${go}" == 'n' ];then
		#echo '您选择了取消安装,退出!';
		echo 'Your alrea cancel the install.';
		exit 1;
	fi
	
	
	
	yum install ntp -y
	echo 'Synchronizing system time..'
	ntpdate asia.pool.ntp.org
	ntpdate time.nuri.net
	
	
	#替换YUM源
	#if [ ! -f "/usr/bin/wget" ];then
	#	yum install wget -y
	#fi
	#mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
	isCentos7=`cat /etc/redhat-release | grep 7\..* | grep -i centos`
	#if [ "${isCentos7}" != '' ];then
	#	wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS7-Base-163.repo
	#else
	#	isCentos6=`cat /etc/redhat-release | grep 6\..* | grep -i centos`
	#	if [ "${isCentos6}" != '' ];then
	#		wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS6-Base-163.repo
	#	else
	#		wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS5-Base-163.repo
	#	fi
	#fi
	
	#yum clean all
	#yum makecache
	
	
	echo "#!/bin/bash
# chkconfig: 2345 55 25
# description: YunClient Cloud Service

### BEGIN INIT INFO
# Provides:          yunclient
# Required-Start:    \$all
# Required-Stop:     \$all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts yunclient
# Description:       starts the BT-Web
### END INIT INFO

case \"\$1\" in
        'start')
                /www/server/cloud/cloud start
                ;;
        'stop')
                /www/server/cloud/cloud stop
                ;;
        'restart')
                /www/server/cloud/cloud restart
                ;;

esac" > /etc/init.d/yunclient
	
	chmod 755 /etc/init.d/yunclient;
	chkconfig --add yunclient
	chkconfig --level 2345 yunclient on
	
	startTime=`date +%s`
	
	Download_File
	
	Start_Install
	Install_Yunclient

	service yunclient start
		if [ -f "/etc/init.d/iptables" ];then
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 20 -j ACCEPT
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 21 -j ACCEPT
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 888 -j ACCEPT
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 30000:40000 -j ACCEPT
		service iptables save
	
		iptables_status=`service iptables status | grep 'not running'`
		if [ ${iptables_status} == '' ];then
			service iptables restart
		fi
	fi
	
	if [ "${isCentos7}" != '' ];then
		if [ ! -f "/etc/init.d/iptables" ];then
			yum install firewalld -y
			systemctl enable firewalld
			systemctl start firewalld
			firewall-cmd --permanent --zone=public --add-port=20/tcp
			firewall-cmd --permanent --zone=public --add-port=21/tcp
			firewall-cmd --permanent --zone=public --add-port=22/tcp
			firewall-cmd --permanent --zone=public --add-port=80/tcp
			firewall-cmd --permanent --zone=public --add-port=888/tcp
			firewall-cmd --permanent --zone=public --add-port=30000-40000/tcp
			firewall-cmd --reload
		fi
	fi
	
	
	#替换回原来的YUM源
	#rm -f /etc/yum.repos.d/CentOS-Base.repo
	#mv /etc/yum.repos.d/CentOS-Base.repo.bak /etc/yum.repos.d/CentOS-Base.repo 
	#yum clean all
	rm -f /tmp/bt_lock.pl
	#输出安装结果
	echo "  
DefaultSiteUrl: http://SERVER_IP:888
MySQLPassword: $mysqlpwd
phpMyAdmin: http://SERVER_IP:888/phpmyadmin_$phpmyadminExt
$cloud" > /www/server/default.pl
	echo "${mysqlpwd}" > /www/server/mysql/default.pl
	echo "====================================="
	#echo "安装完成!"
	echo -e "\033[32mThe install successful!\033[0m"
	echo -e "====================================="
	cat /www/server/default.pl
	echo -e "====================================="
	mv -f install.sh /www/server/install.sh
	endTime=`date +%s`
	((outTime=($endTime-$startTime)/60))
	echo -e "Time consuming:\033[32m $outTime \033[0mMinute!"
	echo "rpm" > /www/server/type.pl
}

Download_File()
{
	cd ${run_path}
	wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/libiconv-1.14.rpm
	if [ ! -f 'libiconv-1.14.rpm' ];then
		echo "Download error of libiconv-1.14.rpm";
		exit 0;
	fi
	wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/libmcrypt-2.5.8.rpm
	if [ ! -f 'libmcrypt-2.5.8.rpm' ];then
		echo "Download error of libmcrypt-2.5.8.rpm";
		exit 0;
	fi
	wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/mcrypt-2.6.8.rpm
	if [ ! -f 'mcrypt-2.6.8.rpm' ];then
		echo "Download error of mcrypt-2.6.8.rpm";
		exit 0;
	fi
	wget ${Download_Url}/rpm/${rpm_path}/${Is_64bit}/mhash-0.9.9.9.rpm
	if [ ! -f 'mhash-0.9.9.9.rpm' ];then
		echo "Download error of mhash-0.9.9.9.rpm";
		exit 0;
	fi
		
	wget -c $Download_Url/cloud.zip -T20
	if [ ! -f "cloud.zip" ];then
		echo "Download error of cloud.zip";
		exit 0;
	fi
	wget -O zun.init $Download_Url/src/zun.init -T20
	wget -O default.zip $Download_Url/src/default.zip -T20
	if [ ! -f "default.zip" ];then
		echo "Download error of default.zip";
		exit 0;
	fi
	if [ "${vstr}" == '52' ] || [ "${vstr}" == '53' ];then
		wget -O phpMyAdmin.zip $Download_Url/src/phpMyAdmin-4.0.10.15.zip -T20
	else
		wget -O phpMyAdmin.zip $Download_Url/src/phpMyAdmin-4.4.15.6.zip -T20
	fi
	
	if [ ! -f "phpMyAdmin.zip" ];then
		echo "Download error of phpMyAdmin.zip";
		exit 0;
	fi
}

Start_Install()
{
	sed -i "s#SELINUX=enforcing#SELINUX=disabled#" /etc/selinux/config
	
	#清空YUM缓存
	yum clean all
	
	yum -y remove mysql mysql-devel php nginx httpd
	rpm -e --nodeps mariadb-libs-*
	if [ -d "/www/server/data" ];then
		mv -f /www/server/data /www/server/data_backup_$dates
	fi
	
	
	rm -f /var/run/yum.pid
	yumPacks='make cmake gcc gcc-c++ gcc-g77 flex bison file libtool libtool-libs autoconf kernel-devel patch wget libjpeg libjpeg-devel libpng libpng-devel libpng10 libpng10-devel gd gd-devel libxml2 libxml2-devel zlib zlib-devel glib2 glib2-devel tar bzip2 bzip2-devel libevent libevent-devel ncurses ncurses-devel curl curl-devel libcurl libcurl-devel e2fsprogs e2fsprogs-devel krb5 krb5-devel libidn libidn-devel openssl openssl-devel vim-minimal gettext gettext-devel ncurses-devel gmp-devel pspell-devel libcap diffutils ca-certificates net-tools libc-client-devel psmisc libXpm-devel git-core c-ares-devel libicu-devel libxslt libxslt-devel zip unzip glibc.i686 libstdc++.so.6 cairo-devel bison-devel ncurses-devel libaio-devel perl perl-devel perl-Data-Dumper lsof pcre pcre-devel';
	yum -y install $yumPacks
	if [ ! -f '/usr/bin/cmake' ];then
		for packages in $yumPacks;
			do yum -y install $packages; done
	fi
	
	echo 'bt' > /tmp/bt_lock.pl
	Install_SendMail
	Install_Pcre
	yum -y install $yumPacks
	Install_Curl
	Install_Mhash
	Install_Libmcrypt
	Install_Mcrypt	
	Install_Libiconv
	#Install_Autoconf
	groupadd www
	useradd -s /sbin/nologin -M -g www www
	
	
	
	if [ "${type}" == 'nginx' ];then
		Install_Nginx
	else
		if [ "${apacheVersion}" == "${apache_24_version}" ];then
			Install_Apache_24
		else
			Install_Apache_22
		fi
	fi
	
	
	
	case "${mysql}" in
		'5.5')
			Install_MySQL_55
			;;
		'5.6')
			Install_MySQL_56
			;;
		'5.7')
			Install_MySQL_57
			;;
		'5.5[RPM]')
			Install_MySQL_RPM
			;;
		'5.6[RPM]')
			Install_MySQL_RPM
			;;
	esac
	
	centosVersion=`cat /etc/redhat-release | grep '6.7'`
	if [ "${centosVersion}" != '' ];then
		echo 'CentOS release 6.8 (Final)' > /etc/redhat-release
	fi
	
	ln -s /www/server/mysql/lib/libmysqlclient.so /usr/local/lib/libmysqlclient.so
	ln -s /www/server/mysql/lib/libmysqlclient.so.18 /usr/local/lib/libmysqlclient.so.18
	echo '/usr/local/lib' >> /etc/ld.so.conf
	ldconfig
	
	case "${vphp}" in
		'5.2')
			Install_PHP_52
			;;
		'5.3')
			Install_PHP_53
			;;
		'5.4')
			Install_PHP_54
			;;
		'5.5')
			Install_PHP_55
			;;
		'5.6')
			Install_PHP_56
			;;
		'7.0')
			Install_PHP_70
			;;
		'7.1')
			Install_PHP_71
			;;
		'ALL')
			Install_PHP_52
			Install_PHP_53
			Install_PHP_54
			Install_PHP_55
			Install_PHP_56
			Install_PHP_70
			Install_PHP_71
			# if [ $main == 0 ];then
			# 	Install_PHP_55
			# 	Install_PHP_56
			# 	Install_PHP_70
			# fi
			;;
	esac
	if [ -f "/www/server/php/53/bin/php" ];then
		if [ ! -f "/etc/init.d/php-fpm-53" ];then
			\cp /etc/init.d/php-fpm-54 /etc/init.d/php-fpm-53
			sed -i "s@php/54@php/53@g" /etc/init.d/php-fpm-53
			chkconfig --add php-fpm-53
			chkconfig --level 2345 php-fpm-53 off
			service php-fpm-53 start
		fi
	fi
	echo "${vphp}" > /www/server/php/version.pl
	
	if [ "${vphp}" != 'ALL' ];then
		ver_sock=$vstr
	else
		ver_sock="54"
	fi
if [ "${type}" == 'nginx' ];then
	echo "
location ~ [^/]\.php(/|$)
{
	try_files \$uri =404;
	fastcgi_pass  unix:/tmp/php-cgi-${ver_sock}.sock;
	fastcgi_index index.php;
	include fastcgi.conf;
	#include pathinfo.conf;
}" > /www/server/nginx/conf/enable-php.conf
	
	service nginx reload
else
	sed -i "s#VERSION#${ver_sock}#" /www/server/apache/conf/extra/httpd-vhosts.conf
	service httpd reload
fi

	wget -O /www/server/uninstall.sh $Download_Url/src/uninstall.sh -T20
	rm -rf /patch
	rm -f *.gz
	#curl http://www.bt.cn/Api/SetupCount?type=Linux
}

Restart_Kill(){
	if [ "${type}" == 'nginx' ];then
		service php-fpm-52 stop
		service php-fpm-53 stop
		service php-fpm-54 stop
		service php-fpm-55 stop
		service php-fpm-56 stop
		service php-fpm-70 stop
		service php-fpm-71 stop
		
		rm -r /tmp/php-cgi-52.sock
		rm -r /tmp/php-cgi-53.sock
		rm -r /tmp/php-cgi-54.sock
		rm -r /tmp/php-cgi-55.sock
		rm -r /tmp/php-cgi-56.sock
		rm -r /tmp/php-cgi-70.sock
		rm -r /tmp/php-cgi-71.sock
		
		service php-fpm-52 start
		service php-fpm-53 start
		service php-fpm-54 start
		service php-fpm-55 start
		service php-fpm-56 start
		service php-fpm-70 start
		service php-fpm-71 start
		service nginx restart
	else
		service httpd restart
	fi
	service mysqld restart
	service yunclient start
	chkconfig --level 2345 yunclient on
}

Install_PHP(){
	echo '=======================================================';
	echo '1) PHP-5.2';
	echo '2) PHP-5.3';
	echo '3) PHP-5.4';
	echo "4) PHP-${php-55}";
	echo "5) PHP-${php-56}";
	echo "6) PHP-${php-70}";
	echo "7) PHP-7.1";
	#echo '请选择要添加的PHP版本.';
	read -p "Plese select to add php version(1-7): " php;
	echo '=======================================================';
	
	case "${php}" in
		'1')
			vphp='5.2'
			vstr='52'
			;;
		'2')
			vphp='5.3'
			vstr='53'
			;;
		'3')
			vphp='5.4'
			vstr='54'
			;;
		'4')
			vphp='5.5'
			vstr='55'
			;;
		'5')
			vphp='5.6'
			vstr='56'
			;;
		'6')
			vphp='7.0'
			vstr='70'
			;;
		'7')
			vphp='7.1'
			vstr='71'
			;;
	esac
	
	#echo "环境校验通过!";
	while [ "$go" != 'y' ] && [ "$go" != 'n' ]
	do
		#echo "现在开始安装PHP-$vphp吗?";
		read -p "Ready You a start the PHP-$vphp installation?(y/n): " go;
	done
	if [ "${go}" == 'n' ];then
		#echo '您选择了取消安装,退出!';
		echo 'Your alrea cancel the install.';
		exit 1;
	fi
	
	case "${vphp}" in
		'5.2')
			Install_PHP_52
			;;
		'5.3')
			Install_PHP_53
			;;
		'5.4')
			Install_PHP_54
			;;
		'5.5')
			Install_PHP_55
			;;
		'5.6')
			Install_PHP_56
			;;
		'7.0')
			Install_PHP_70
			;;
		'7.1')
			Install_PHP_70
			;;
	esac
	echo "ALL" > /www/server/php/version.pl
	echo '=======================================================';
	#echo "php-$vphp 安装成功!"
	echo "php-$vphp successful"
}

Close_MySQL()
{
    Data_Path='/www/server/data'
	if [ -d "${Data_Path}" ];then
		mkdir -p /www/backup
		mv $Data_Path  /www/backup/oldData
		rm -rf $Data_Path
	fi
	
	chkconfig --del mysqld
	rm -rf /etc/init.d/mysqld
	rm -f /etc/my.cnf
}

Install_MySQL()
{
	
	echo '=======================================================';
	MemTotal=`free -m | grep Mem | awk '{sum+=$2} END {print sum}'`
	echo '1) MySQL 5.5[default]'
	echo -e "\033[32m2) MySQL 5.5[RPM] \033[0m"
    if [ ${MemTotal} -gt 900 ]; then
		echo '3) MySQL 5.6'
		echo -e "\033[32m4) MySQL 5.6[RPM] \033[0m"
	else
		echo -e "\033[31m Memory is less than 1GB, hidden MySQL5.6 installation options. \033[0m";
	fi
	if [ ${MemTotal} -gt 1800 ]; then
		echo '5) MySQL 5.7'
	else
		echo -e "\033[31m Memory less than 2GB, hidden MySQL5.7 installation options. \033[0m";
	fi
	#echo '请选择MySQL版本';
	read -p 'Plese select mysql version(1-5 default:1): ' mysql;
	echo '=======================================================';
	
	case "${mysql}" in
		'1')
			mysql='5.5'
			;;
		'2')
			mysql='5.5[RPM]'
			mysqlVersion='5.5.47'
			;;
		'3')
			mysql='5.6'
			;;
		'4')
			mysql='5.6[RPM]'
			mysqlVersion='5.6.28'
			;;
		'5')
			mysql='5.7'
			;;
		*)
			mysql='5.5'
	esac
	
	echo "环境校验通过!";
	echo '=======================================================';
	dates=`date`;
	pwd=`echo -n $dates|md5sum|cut -d ' ' -f1`;
	pwd=${pwd:0:10};
	#echo '请输入MySQL管理密码';
	read -p "Plese input mysql admin password (default:$pwd): " mysqlpwd;
	echo '=======================================================';
	while [ "$go" != 'y' ] && [ "$go" != 'n' ]
	do
		#echo "现在开始安装MySQL-$mysqlv吗?";
		read -p "Ready You a start the MySQL-$mysql installation?(y/n): " go;
	done
	if [ "$go" == 'n' ];then
		exit;
	fi
	
	if [ "${mysqlpwd}" == '' ];then
		mysqlpwd=${pwd}
	fi
	
	service mysqld stop
	chkconfig --del mysqld
	rm -f /etc/init.d/mysqld
	rm -f /etc/my.cnf
	rm -rf /www/server/mysql
	dates=`date +"%Y%m%d"`
	mv /www/server/data /www/server/data_backup_$dates
	
	case "${mysql}" in
		'5.5')
			Install_MySQL_55
			;;
		'5.6')
			Install_MySQL_56
			;;
		'5.7')
			Install_MySQL_57
			;;
		'5.5[RPM]')
			Install_MySQL_RPM
			;;
		'5.6[RPM]')
			Install_MySQL_RPM
			;;
	esac
	
	Install_Web
	echo "${mysqlpwd}" /www/server/mysql/default.pl
	
	
	echo '=======================================================';
	echo "MySQL-$mysql 安装成功!"
	echo "MySQL-$mysql successful"
}
#修复面板
RepWeb()
{
	#echo '请输入MySQL管理密码';
	read -p "Plese input mysql admin password (default:$pwd): " mysqlpwd;
	while [ "$go" != 'y' ] && [ "$go" != 'n' ]
	do
		#echo "现在开始修复WEB吗?";
		read -p "Ready You a start the WebPanel?(y/n): " go;
	done
	
	if [ "$go" == 'n' ];then
		exit;
	fi
	
	Install_Yunclient
}

CheckPHPVersion()
{
	PHPVersion=""
	if [ -d "/www/server/php/53" ];then
		PHPVersion="53"
	fi
	if [ -d "/www/server/php/54" ];then
		PHPVersion="54"
	fi
	if [ -d "/www/server/php/55" ];then
		PHPVersion="55"
	fi
	if [ -d "/www/server/php/56" ];then
		PHPVersion="56"
	fi
	if [ -d "/www/server/php/70" ];then
		PHPVersion="70"
	fi
	if [ "${PHPVersion}" == '' ];then
		echo 'Not Install PHP.';
		exit 0;
	fi
}


Close_WebServer()
{
	if [ -d "/www/server/apache" ];then
		service httpd stop
		chkconfig --del httpd
		rm -f /etc/init.d/httpd
		rm -rf /www/server/apache
		pkill -9 httpd
	fi
	
	if [ -d "/www/server/nginx" ];then
		service nginx stop
		chkconfig --del nginx
		rm -f /etc/init.d/nginx
		rm -rf /www/server/nginx
		pkill -9 nginx
	fi
}

To_Apache()
{
	CheckPHPVersion
	type='apache'
	apacheVersion="${apache_24_version}";
	
	Close_WebServer
	Install_Apache_24
	
	sed -i "s#VERSION#${PHPVersion}#" /www/server/apache/conf/extra/httpd-vhosts.conf
	service httpd start
	type='apache'
	SetWebType
}

To_Nginx()
{
	CheckPHPVersion
	
	echo '=======================================================';
	echo "1) Nginx-${nginx_version}";
	echo '2) Nginx-1.8.1';
	echo '3) Tengine-2.2.0';
	read -p "Plese select Web Server(1-3 default:1): " type;
	echo '=======================================================';
	case "${type}" in
		'1')
			type='nginx'
			nginxVersion="${nginx_version}"
			;;
		'2')
			type='nginx'
			nginxVersion='1.8.1'
			;;
		'3')
			type='nginx'
			nginxVersion='-Tengine2.2.0'
			;;
		*)
			type='nginx'
			nginxVersion="${nginx_version}"
	esac
	Close_WebServer
	Install_Nginx
	
		echo "
location ~ [^/]\.php(/|$)
{
	try_files \$uri =404;
	fastcgi_pass  unix:/tmp/php-cgi-${PHPVersion}.sock;
	fastcgi_index index.php;
	include fastcgi.conf;
	#include pathinfo.conf;
}" > /www/server/nginx/conf/enable-php.conf
	
	cat /www/server/mysql/default.pl
	service nginx reload
	SetWebType
	
}

SetWebType()
{
	service mysqld stop
	mysqld_safe --skip-grant-tables&
	echo 'Set WebServer Type..'
	sleep 8
	/www/server/mysql/bin/mysql -uroot -e "update bt_default.bt_config set webserver='${type}' where id=1";
	pkill -9 mysqld_safe
	pkill -9 mysqld
	sleep 3
	service mysqld start
}

case $1 in
	add)
		Install_PHP
		exit 0;
		;;
	mysql)
		Install_MySQL
		exit 0;
		;;
	rep)
		RepWeb
		exit 0;
		;;
	apache)
		To_Apache
		exit 0;
		;;
	nginx)
		To_Nginx
		exit 0;
		;;
	*)
		#CheckInstall
		CheckDisk
		Select_Install
		exit 0;
		;;
esac

echo 'args error!'
