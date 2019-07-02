#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
Install_xdebug()
{
	if [ ! -f "/www/server/php/$version/bin/php-config" ];then
		echo "php-$vphp 未安装,请选择其它版本!"
		echo "php-$vphp not install, Plese select other version!"
		exit 0
	fi

	isInstall=`cat /www/server/php/$version/etc/php.ini|grep 'xdebug.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp 已安装过xdebug,请选择其它版本!"
		echo "php-$vphp not install, Plese select other version!"
		exit 0
	fi

	case "${version}" in
		'56')
		extFile='/www/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/xdebug.so'
		;;
		'70')
		extFile='/www/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/xdebug.so'
		;;
		'71')
		extFile='/www/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/xdebug.so'
		;;
		'72')
		extFile='/www/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/xdebug.so'
		;;
		'73')
		extFile='/www/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/xdebug.so'
		;;
	esac
	if [ ! -f "$extFile" ];then

		download_Url=$NODE_URL

		if [ "$version" -ge '70' ];then
			wget -c -O xdebug-2.7.2.tgz $download_Url/src/xdebug-2.7.2.tgz -T 5
			tar zxvf xdebug-2.7.2.tgz
			rm -f xdebug-2.7.2.tgz
			cd xdebug-2.7.2
		else
			wget -c -O xdebug-2.2.7.tgz $download_Url/install/src/xdebug-2.2.7.tgz -T 5
			tar zxvf xdebug-2.2.7.tgz
			rm -f xdebug-2.2.7.tgz
			cd xdebug-2.2.7
		fi
		/www/server/php/$version/bin/phpize
		./configure  --with-php-config=/www/server/php/$version/bin/php-config
		make && make install
		cd ..
		rm -rf xdebug-*
	fi
	if [ ! -f "$extFile" ];then
		echo '安装失败!';
		exit 0
	fi


	echo "zend_extension=$extFile" >> /www/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==========================================================='
	echo 'successful!'

	rm -f *.zip
	rm -f *.tar.gz
	rm -f *.tgz

}

Uninstall_xdebug()
{
	if [ ! -f "/www/server/php/$version/bin/php-config" ];then
		echo "php-$vphp 未安装,请选择其它版本!"
		return
	fi
	isInstall=`cat /www/server/php/$version/etc/php.ini|grep 'xdebug.so'`
	if [ "${isInstall}" == "" ];then
		echo "php-$vphp 未安装xdebug,请选择其它版本!"
		return
	fi

	sed -i '/xdebug/d'  /www/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}

actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}

if [ "$actionType" == 'install' ];then
	Install_xdebug
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_xdebug
fi
