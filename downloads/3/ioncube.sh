#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

. /www/server/panel/script/public.sh
download_Url=$NODE_URL

Install_Ioncube()
{
	if [ ! -f "/www/server/php/$version/bin/php-config" ];then
		echo "php-$vphp 未安装,请选择其它版本!"
		echo "php-$vphp not install, Plese select other version!"
		return
	fi
	isInstall=`cat /www/server/php/$version/etc/php.ini|grep 'ioncube_loader_lin'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp 已安装过ioncube,请选择其它版本!"
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	download_Url=$NODE_URL

	mkdir /usr/local/ioncube
	Is_64bit=`getconf LONG_BIT`
	wget -O /usr/local/ioncube/ioncube_loader_lin_$vphp.so $download_Url/src/ioncube/$Is_64bit/ioncube_loader_lin_$vphp.so
	sed -i -e "/;ionCube/a\zend_extension = /usr/local/ioncube/ioncube_loader_lin_${vphp}.so" /www/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	/www/server/php/$version/bin/php -v

}

Uninstall_Ioncube()
{
	if [ ! -f "/www/server/php/$version/bin/php-config" ];then
		echo "php-$vphp 未安装,请选择其它版本!"
		echo "php-$vphp not install, Plese select other version!"
		return
	fi
	isInstall=`cat /www/server/php/$version/etc/php.ini|grep 'ioncube_loader_lin'`
	if [ "${isInstall}" = "" ];then
		echo "php-$vphp 未安装ioncube,请选择其它版本!"
		echo "php-$vphp not install ioncube, Plese select other version!"
		return
	fi

	rm -f /usr/local/ioncube/ioncube_loader_lin_${vphp}.so
	sed -i '/ioncube_loader_lin/d' /www/server/php/$version/etc/php.ini
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
