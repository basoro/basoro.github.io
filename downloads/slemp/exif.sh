#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

. /opt/slemp/server/panel/script/public.sh
download_Url=http://basoro.id/downloads/slemp

Install_Exif()
{

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'exif.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp Exif diinstal, silakan pilih versi lain!"
		return
	fi

	if [ ! -d "/opt/slemp/server/php/$version/src/ext/exif" ];then
		mkdir -p /opt/slemp/server/php/$version/src
		wget -O ext-$version.zip $download_Url/ext/ext-$version.zip
		unzip -o ext-$version.zip -d /opt/slemp/server/php/$version/src/ > /dev/null
		mv /opt/slemp/server/php/$version/src/ext-$version /opt/slemp/server/php/$version/src/ext
		rm -f ext-$version.zip
	fi

	case "${version}" in
		'56')
		extFile='/opt/slemp/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/exif.so'
		;;
		'70')
		extFile='/opt/slemp/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/exif.so'
		;;
		'71')
		extFile='/opt/slemp/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/exif.so'
		;;
		'72')
		extFile='/opt/slemp/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/exif.so'
		;;
		'73')
		extFile='/opt/slemp/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/exif.so'
		;;

	esac


	if [ ! -f "$extFile" ];then
		cd /opt/slemp/server/php/$version/src/ext/exif
		/opt/slemp/server/php/$version/bin/phpize
		./configure --with-php-config=/opt/slemp/server/php/$version/bin/php-config
		make && make install
	fi

	if [ ! -f "$extFile" ];then
		echo "ERROR!"
		return;
	fi

	echo "extension=$extFile" >> /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==========================================================='
	echo 'successful!'
}


Uninstall_Exif()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp Tidak terpasang, silakan pilih versi lain!"
		return
	fi
	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'exif.so'`
	if [ "${isInstall}" == "" ];then
		echo "php-$vphp Exif belum diinstal, silakan pilih versi lain!"
		return
	fi

	sed -i '/exif.so/d'  /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}


actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_Exif
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_Exif
fi
