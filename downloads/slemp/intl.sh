#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

. /opt/slemp/server/panel/script/public.sh
download_Url=http://basoro.id/downloads/slemp

Install_Intl()
{
	case "${version}" in
		'56')
		extFile='/opt/slemp/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/intl.so'
		;;
		'70')
		extFile='/opt/slemp/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/intl.so'
		;;
		'71')
		extFile='/opt/slemp/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/intl.so'
		;;
		'72')
		extFile='/opt/slemp/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/intl.so'
		;;
		'73')
		extFile='/opt/slemp/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/intl.so'
		;;
	esac

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'intl.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp Intl terinstal, silakan pilih versi lain!"
		return
	fi

	if [ ! -d "/opt/slemp/server/php/$version/src/ext/intl" ];then
		mkdir -p /opt/slemp/server/php/$version/src
		wget -O ext-$version.zip $download_Url/ext/ext-$version.zip
		unzip -o ext-$version.zip -d /opt/slemp/server/php/$version/src/ > /dev/null
		mv /opt/slemp/server/php/$version/src/ext-$version /opt/slemp/server/php/$version/src/ext
		rm -f ext-$version.zip
	fi


	if [ ! -f "$extFile" ];then
		yum install icu -y
		cd /opt/slemp/server/php/$version/src/ext/intl
		/opt/slemp/server/php/$version/bin/phpize
		./configure --with-php-config=/opt/slemp/server/php/$version/bin/php-config
		make && make install
	fi

	if [ ! -f "$extFile" ];then
		echo "ERROR!"
		return;
	fi
	if [ "$version" = '53' ];then
		echo "extension=$extFile" >> /opt/slemp/server/php/$version/etc/php.ini
	else
		echo ";extension=$extFile" >> /opt/slemp/server/php/$version/etc/php.ini
	fi
	service php-fpm-$version reload
	echo '==========================================================='
	echo 'successful!'
}


Uninstall_Intl()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp Tidak terpasang, silakan pilih versi lain!"
		return
	fi

	case "${version}" in
		'56')
		extFile='/opt/slemp/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/intl.so'
		;;
		'70')
		extFile='/opt/slemp/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/intl.so'
		;;
		'71')
		extFile='/opt/slemp/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/intl.so'
		;;
		'72')
		extFile='/opt/slemp/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/intl.so'
		;;
		'73')
		extFile='/opt/slemp/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/intl.so'
		;;
	esac
	if [ ! -f "$extFile" ];then
		echo "php-$vphp Intl tidak diinstal, silakan pilih versi lain!"
		return
	fi

	sed -i '/intl.so/d'  /opt/slemp/server/php/$version/etc/php.ini

	rm -f $extFile
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}


actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_Intl
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_Intl
fi
