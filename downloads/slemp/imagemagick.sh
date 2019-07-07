#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
LANG=en_US.UTF-8

. /opt/slemp/server/panel/script/public.sh
download_Url=https://basoro.id/downloads/slemp

cpuInfo=$(getconf _NPROCESSORS_ONLN)
if [ "${cpuInfo}" -ge "4" ];then
	cpuCore=$((${cpuInfo}-1))
else
	cpuCore="1"
fi


Install_imagemagick()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'imagick.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	if [ ! -d "/usr/local/imagemagick" ];then
		yum install libpng* libjpeg* gd-devel -y
		yum install gtk2 OpenEXR-libs gdk-pixbuf2 ghostscript ghostscript-fonts ilmbase libwmf libwmf-lite urw-fonts xorg-x11-font-utils glib2 -y
		wget $download_Url/src/ImageMagick.tar.gz -T 5
		tar -zxf ImageMagick.tar.gz
		cd ImageMagick-7.0.3-7
		./configure --prefix=/usr/local/imagemagick
		make -j${cpuInfo}
		make install
		if [ -d "/local/imagemagick/bin" ];then
			echo "export PATH=$PATH:/usr/local/imagemagick/bin" >> /etc/profile
			source /etc/profile
		fi
		cd ../
		rm -rf ImageMagick*
	fi

	case "${version}" in
		'56')
		extFile='/opt/slemp/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/imagick.so'
		;;
		'70')
		extFile='/opt/slemp/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/imagick.so'
		;;
		'71')
		extFile='/opt/slemp/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/imagick.so'
		;;
		'72')
		extFile='/opt/slemp/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/imagick.so'
		;;
		'73')
		extFile='/opt/slemp/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/imagick.so'
		;;
	esac
	if [ ! -f "$extFile" ];then
		wget $download_Url/src/imagick-3.4.3.tgz -T 5
		tar -zxf imagick-3.4.3.tgz
		cd imagick-3.4.3
		/opt/slemp/server/php/$version/bin/phpize
		if [ -f "/usr/local/imagemagick/bin/MagickWand-config" ]; then
			./configure --with-php-config=/opt/slemp/server/php/$version/bin/php-config --with-imagick=/usr/local/imagemagick
		else
			yum install ImageMagick ImageMagick-devel -y
			./configure --with-php-config=/opt/slemp/server/php/$version/bin/php-config
		fi

		make && make install
	fi

	if [ ! -f "$extFile" ];then
		echo 'error';
		exit 0;
	fi


	echo -e "\n[ImageMagick]\nextension = \"imagick.so\"\n" >> /opt/slemp/server/php/$version/etc/php.ini

	cd ../
	rm -rf imagick*
	service php-fpm-$version reload
}


Uninstall_imagemagick()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'imagick.so'`
	if [ "${isInstall}" = "" ];then
		echo "php-$vphp not install imagemagick, Plese select other version!"
		return
	fi

	sed -i '/imagick.so/d' /opt/slemp/server/php/$version/etc/php.ini
	sed -i '/ImageMagick/d' /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}


actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_imagemagick
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_imagemagick
fi
