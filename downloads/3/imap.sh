#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
LANG=en_US.UTF-8

. /www/server/panel/script/public.sh
download_Url=$NODE_URL

Install_Imap()
{
	isInstall=`cat /www/server/php/$version/etc/php.ini|grep 'imap.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp 已安装xdebug,请选择其它版本!"
		return
	fi

	download_Url=$NODE_URL

	if [ ! -d "/www/server/php/$version/src/ext/imap" ];then
		mkdir -p /www/server/php/$version/src
		wget -O ext-$version.zip $download_Url/install/ext/ext-$version.zip -T 5
		unzip -o ext-$version.zip -d /www/server/php/$version/src/ > /dev/null
		mv /www/server/php/$version/src/ext-$version /www/server/php/$version/src/ext
		rm -f ext-$version.zip
	fi

	case "${version}" in
		'56')
		extFile='/www/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/imap.so'
		;;
		'70')
		extFile='/www/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/imap.so'
		;;
		'71')
		extFile='/www/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/imap.so'
		;;
		'72')
		extFile='/www/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/imap.so'
		;;
		'73')
		extFile='/www/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/imap.so'
		;;
	esac


	if [ ! -f "$extFile" ];then
		Is_64bit=`getconf LONG_BIT`
		isCentos7=`cat /etc/redhat-release | grep ' 7.'`
		if [ "$isCentos7" != "" ];then
			if [ ! -f "/usr/local/imap-2007f/lib/libc-client.a" ];then
				yum -y install pam-devel
				wget $download_Url/src/imap-2007f.tar.gz -T 5
				tar -zxf imap-2007f.tar.gz
				cd imap-2007f
				if [ "$Is_64bit" == "64" ];then
					make lr5 PASSWDTYPE=std SSLTYPE=unix.nopwd EXTRACFLAGS=-fPIC IP=4 EXTRACFLAGS=-fPIC
				else
					make lr5 PASSWDTYPE=std SSLTYPE=unix.nopwd EXTRACFLAGS=-fPIC IP=4
				fi
				rm -rf /usr/local/imap-2007f/
				mkdir /usr/local/imap-2007f/
				mkdir /usr/local/imap-2007f/include/
				mkdir /usr/local/imap-2007f/lib/
				cp c-client/*.h /usr/local/imap-2007f/include/
				cp c-client/*.c /usr/local/imap-2007f/lib/
				cp c-client/c-client.a /usr/local/imap-2007f/lib/libc-client.a

				cd ..
				rm -rf imap-2007f*
			fi

			cd /www/server/php/$version/src/ext/imap
			/www/server/php/$version/bin/phpize
			./configure --with-php-config=/www/server/php/$version/bin/php-config --with-imap=/usr/local/imap-2007f --with-imap-ssl
			make && make install
		else
			yum -y install pam-devel libc-client-devel
			ln -s /usr/lib64/libc-client.so /usr/lib/libc-client.so
			cd /www/server/php/$version/src/ext/imap
			/www/server/php/$version/bin/phpize
			./configure --with-php-config=/www/server/php/$version/bin/php-config --with-imap --with-imap-ssl --with-kerberos
			make && make install
		fi
	fi

	if [ ! -f "$extFile" ];then
		echo "ERROR!"
		exit 0;
	fi

	echo "extension=$extFile" >> /www/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==========================================================='
	echo 'successful!'
}


Uninstall_Imap()
{
	if [ ! -f "/www/server/php/$version/bin/php-config" ];then
		echo "php-$vphp 未安装,请选择其它版本!"
		return
	fi
	isInstall=`cat /www/server/php/$version/etc/php.ini|grep 'imap.so'`
	if [ "${isInstall}" == "" ];then
		echo "php-$vphp 未安装xdebug,请选择其它版本!"
		return
	fi

	sed -i '/imap.so/d'  /www/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}


actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_Imap
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_Imap
fi
