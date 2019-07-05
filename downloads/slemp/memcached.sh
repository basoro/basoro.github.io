#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

memcachedVer="1.5.16"
memcachedPhpVer="3.1.3"

download_Url=$NODE_URL
srcPath='/root';

System_Lib(){
	if [ "${PM}" == "yum" ] || [ "${PM}" == "dnf" ] ; then
		removePack="libmemcached libmemcached-devel"
		installPack="cyrus-sasl cyrus-sasl-devel libevent libevent-devel"
	elif [ "${PM}" == "apt-get" ]; then
		removePack="memcached"
		installPack="libsasl2-2 libsasl2-dev libevent-dev"
	fi
	[ "${removePack}" != "" ] && ${PM} remove ${removePack} -y
	[ "${installPack}" != "" ] && ${PM} install ${installPack} -y
}

Service_Add(){
	if [ "${PM}" == "yum" ] || [ "${PM}" == "dnf" ]; then
		chkconfig --add memcached
		chkconfig --level 2345 memcached on
	elif [ "${PM}" == "apt-get" ]; then
		update-rc.d memcached defaults
	fi
}
Service_Del(){
 	if [ "${PM}" == "yum" ] || [ "${PM}" == "dnf" ]; then
		chkconfig --del memcached
		chkconfig --level 2345 memcached off
	elif [ "${PM}" == "apt-get" ]; then
		update-rc.d memcached remove
	fi
}
Ext_Path(){
	case "${version}" in
		'56')
		extFile='/opt/slemp/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/memcached.so'
		;;
		'70')
		extFile='/opt/slemp/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/memcached.so'
		;;
		'71')
		extFile='/opt/slemp/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/memcached.so'
		;;
		'72')
		extFile='/opt/slemp/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/memcached.so'
		;;
		'73')
		extFile='/opt/slemp/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/memcached.so'
		;;
	esac
}

Install_Memcached()
{
	if [ ! -f "/usr/local/memcached/bin/memcached" ];then
		groupadd memcached
		useradd -s /sbin/nologin -g memcached memcached
		cd $srcPath
		wget $download_Url/src/memcached-${memcachedVer}.tar.gz -T 5
		tar -xzf memcached-${memcachedVer}.tar.gz
		cd memcached-${memcachedVer}
		./configure --prefix=/usr/local/memcached
		make -j ${cpuCore}
		make install
		ln -sf /usr/local/memcached/bin/memcached /usr/bin/memcached
		wget -O /etc/init.d/memcached $download_Url/init/init.d.memcached -T 5
		chmod +x /etc/init.d/memcached
		/etc/init.d/memcached start

		cd $srcPath
		rm -rf memcached*
	fi

	if [ -f "/usr/local/libmemcached/lib/libmemcached.so" ]; then
		LIB_MEMCACHED_SASL=$(ldd /usr/local/libmemcached/lib/libmemcached.so|grep sasl)
		[ -z "${LIB_MEMCACHED_SASL}" ] && rm -rf /usr/local/libmemcached
	fi

	if [ ! -f "/usr/local/libmemcached/lib/libmemcached.so" ];then
		cd $srcPath
		wget $download_Url/src/libmemcached-1.0.18.tar.gz -T 5
		tar -zxf libmemcached-1.0.18.tar.gz
		cd libmemcached-1.0.18
		./configure --prefix=/usr/local/libmemcached --with-memcached
		make && make install
		cd ../
		rm -rf libmemcached*
	fi

	if [ ! -d /opt/slemp/server/php/$version ];then
		return;
	fi

	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp 未安装,请选择其它版本!"
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'memcached.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp 已安装过memcached,请选择其它版本!"
		echo "php-$vphp is already install memcached, Plese select other version!"
		return
	fi

	if [ ! -f "${extFile}" ];then
		cd $srcPath
		if [ "${version}" -ge "70" ];then
			wget $download_Url/src/memcached-${memcachedPhpVer}.tgz -T 5
			tar -xvf memcached-${memcachedPhpVer}.tgz
			cd memcached-${memcachedPhpVer}

			/opt/slemp/server/php/$version/bin/phpize
			./configure --with-php-config=/opt/slemp/server/php/$version/bin/php-config --enable-memcached --with-libmemcached-dir=/usr/local/libmemcached --enable-sasl
			make && make install
			cd $srcPath
			rm -f memcached-${memcachedPhpVer}${memcachedPhpVer}.tgz
			rm -rf memcached-${memcachedPhpVer}
		else
			wget $download_Url/src/memcached-2.2.0.tgz -T 5
			tar -zxf memcached-2.2.0.tgz
			cd memcached-2.2.0
			/opt/slemp/server/php/$version/bin/phpize
			./configure --with-php-config=/opt/slemp/server/php/$version/bin/php-config --enable-memcached --with-libmemcached-dir=/usr/local/libmemcached --enable-sasl
			make && make install
			cd $srcPath
			rm -rf memcached*
		fi
	fi

	if [ ! -f "$extFile" ];then
		echo 'Install failed';
		exit 0;
	fi

	echo "extension=memcached.so" >> /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
	/opt/slemp/server/php/${version}/bin/php -m|grep memcached
}


Uninstall_Memcached()
{
	if [ ! -d /opt/slemp/server/php/$version ];then
		/etc/init.d/memcached stop
		pkill -9 memcached
		Service_Off
		rm -f /etc/init.d/memcached
		rm -rf /usr/local/memcached
		return;
	fi

	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp 未安装,请选择其它版本!"
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'memcached.so'`
	if [ "${isInstall}" = "" ];then
		echo "php-$vphp 未安装memcached,请选择其它版本!"
		echo "php-$vphp not install memcached, Plese select other version!"
		return
	fi

	rm -f ${extFile}
	sed -i '/memcached.so/d'  /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}
Update_memcached(){
	cd $srcPath
	wget $download_Url/src/memcached-${memcachedVer}.tar.gz -T 20
	tar -xzf memcached-${memcachedVer}.tar.gz
	cd memcached-${memcachedVer}
	./configure --prefix=/usr/local/memcached
	make

	/etc/init.d/memcached stop
	[ -d "/usr/local/memcached.bak" ] &&  rm -rf /usr/local/memcached.bak
	mv /usr/local/memcached /usr/local/memcached.bak
	make install
	if [ ! -f "/usr/local/memcached/bin/memcached" ];then
		echo "update failed"
		echo "try Restore"
		mv /usr/local/memcached.bak /usr/local/memcached
		sleep 1
		/etc/init.d/memcached start
		exit;
	fi
	sleep 1
	/etc/init.d/memcached start
}

actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	System_Lib
	Ext_Path
	Install_Memcached
	Service_Add
elif [ "$actionType" == 'uninstall' ];then
	Ext_Path
	Uninstall_Memcached
	Service_Del
elif [ "${actionType}" == "update" ]; then
	Update_memcached
fi
