#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

. /opt/slemp/server/panel/script/public.sh
download_Url=https://basoro.id/downloads/slemp

Install_Ioncube()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi
	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'ioncube_loader_lin'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	mkdir /usr/local/ioncube
	Is_64bit=`getconf LONG_BIT`
	#wget -O /usr/local/ioncube/ioncube_loader_lin_$vphp.so $download_Url/src/ioncube/$Is_64bit/ioncube_loader_lin_$vphp.so
	wget -O /usr/local/ioncube/ioncube_loader_lin_$vphp.so $download_Url/src/ioncube/ioncube_loader_lin_$vphp.so
	sed -i -e "/;ionCube/a\zend_extension = /usr/local/ioncube/ioncube_loader_lin_${vphp}.so" /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	/opt/slemp/server/php/$version/bin/php -v

}

Uninstall_Ioncube()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi
	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'ioncube_loader_lin'`
	if [ "${isInstall}" = "" ];then
		echo "php-$vphp not install ioncube, Plese select other version!"
		return
	fi

	rm -f /usr/local/ioncube/ioncube_loader_lin_${vphp}.so
	sed -i '/ioncube_loader_lin/d' /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}

actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_Ioncube
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_Ioncube
fi
