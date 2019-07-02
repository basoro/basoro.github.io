#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH


Install_Exif()
{

	download_Url=$NODE_URL

	isInstall=`cat /www/server/php/$version/etc/php.ini|grep 'exif.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp 已安装exif,请选择其它版本!"
		return
	fi

	if [ ! -d "/www/server/php/$version/src/ext/exif" ];then
		mkdir -p /www/server/php/$version/src
		wget -O ext-$version.zip $download_Url/install/ext/ext-$version.zip
		unzip -o ext-$version.zip -d /www/server/php/$version/src/ > /dev/null
		mv /www/server/php/$version/src/ext-$version /www/server/php/$version/src/ext
		rm -f ext-$version.zip
	fi

	case "${version}" in
		'56')
		extFile='/www/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/exif.so'
		;;
		'70')
		extFile='/www/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/exif.so'
		;;
		'71')
		extFile='/www/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/exif.so'
		;;
		'72')
		extFile='/www/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/exif.so'
		;;
		'73')
		extFile='/www/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/exif.so'
		;;

	esac


	if [ ! -f "$extFile" ];then
		cd /www/server/php/$version/src/ext/exif
		/www/server/php/$version/bin/phpize
		./configure --with-php-config=/www/server/php/$version/bin/php-config
		make && make install
	fi

	if [ ! -f "$extFile" ];then
		echo "ERROR!"
		return;
	fi

	echo "extension=$extFile" >> /www/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==========================================================='
	echo 'successful!'
}


Uninstall_Exif()
{
	if [ ! -f "/www/server/php/$version/bin/php-config" ];then
		echo "php-$vphp 未安装,请选择其它版本!"
		return
	fi
	isInstall=`cat /www/server/php/$version/etc/php.ini|grep 'exif.so'`
	if [ "${isInstall}" == "" ];then
		echo "php-$vphp 未安装exif,请选择其它版本!"
		return
	fi

	sed -i '/exif.so/d'  /www/server/php/$version/etc/php.ini
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
