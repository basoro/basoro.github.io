#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

. /opt/slemp/server/panel/script/public.sh
download_Url=$NODE_URL

Install_Opcache()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'opcache.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	case "${version}" in
		'56')
		extFile='/opt/slemp/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/opcache.so'
		;;
		'70')
		extFile='/opt/slemp/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/opcache.so'
		;;
		'71')
		extFile='/opt/slemp/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/opcache.so'
		;;
		'72')
		extFile='/opt/slemp/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/opcache.so'
		;;
		'73')
		extFile='/opt/slemp/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/opcache.so'
		;;
	esac

	if [ ! -f "$extFile" ];then
		download_Url=$NODE_URL
		wget $download_Url/src/zendopcache-7.0.5.tgz
		tar -zxf zendopcache-7.0.5.tgz
		rm -f zendopcache-7.0.5.tgz
		cd zendopcache-7.0.5
		/opt/slemp/server/php/$version/bin/phpize
		./configure --with-php-config=/opt/slemp/server/php/$version/bin/php-config
		make
		make install
		rm -rf zendopcache-7.0.5
	fi



	sed -i '/;opcache./d' /opt/slemp/server/php/$version/etc/php.ini
	sed -i "s#;opcache#;opcache\n[Zend Opcache]\nzend_extension=${extFile}\nopcache.enable = 1\nopcache.memory_consumption=128\nopcache.interned_strings_buffer=8\nopcache.max_accelerated_files=4000\nopcache.revalidate_freq=60\nopcache.fast_shutdown=1\nopcache.enable_cli=1#" /opt/slemp/server/php/$version/etc/php.ini


	service php-fpm-$version reload
}

Uninstall_Opcache()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'opcache.so'`
	if [ "${isInstall}" = "" ];then
		echo "php-$vphp not install Opcache, Plese select other version!"
		return
	fi

	sed -i '/opcache./d' /opt/slemp/server/php/$version/etc/php.ini
	sed -i '/Opcache/d' /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}



actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_Opcache
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_Opcache
fi
