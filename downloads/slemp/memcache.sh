#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

. /opt/slemp/server/panel/script/public.sh
download_Url=$NODE_URL

Install_memcache()
{

	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'memcache.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	download_Url=$NODE_URL

	yum -y remove libmemcached libmemcached-devel
	srcPath='/root';
	if [ ! -f "/usr/local/memcached/bin/memcached" ];then
		cd $srcPath
		wget $download_Url/src/memcached-1.5.0.tar.gz -T 5
		tar -xzf memcached-1.5.0.tar.gz
		cd memcached-1.5.0
		./configure --prefix=/usr/local/memcached
		make && make install
		ln -sf /usr/local/memcached/bin/memcached /usr/bin/memcached

		wget -O /etc/init.d/memcached $download_Url/init/init.d.memcached
		chmod +x /etc/init.d/memcached
		chkconfig --add memcached
		chkconfig --level 2345 memcached on

		#if [ ! -f "/etc/init.d/iptables" ];then
			#firewall-cmd --permanent --zone=public --add-port=11211/tcp
			#firewall-cmd --permanent --zone=public --add-port=11211/udp
			#firewall-cmd --reload
		#else
			#/sbin/iptables -A INPUT -p tcp --dport 11211 -j ACCEPT
			#/sbin/iptables -A INPUT -p udp --dport 11211 -j ACCEPT
			#service iptables save
			#service iptables restart
		#fi

		cd $srcPath
		wget $download_Url/src/libmemcached-1.0.18.tar.gz -T 5
		tar -zxf libmemcached-1.0.18.tar.gz
		cd libmemcached-1.0.18
		./configure --prefix=/usr/local/libmemcached --with-memcached
		make && make install

		service memcached start

		cd $srcPath
		rm -rf memcached*
		rm -rf libmemcached*
	fi
	case "${version}" in
		'56')
		extFile='/opt/slemp/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/memcache.so'
		;;
		'70')
		extFile='/opt/slemp/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/memcache.so'
		;;
		'71')
		extFile='/opt/slemp/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/memcache.so'
		;;
		'72')
		extFile='/opt/slemp/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/memcache.so'
		;;
	esac

	rm -f ${extFile}
	if [ ! -f "${extFile}" ];then
		if [ "${version}" == '70' ] || [ "${version}" == '71' ] || [ "${version}" == '72' ];then
			wget -c $download_Url/src/memcache-3.0.9-dev.zip -T 5
			unzip -o memcache-3.0.9-dev.zip
			cd memcache-3.0.9-dev
			/opt/slemp/server/php/$version/bin/phpize
			./configure  --with-php-config=/opt/slemp/server/php/$version/bin/php-config
			make && make install
			cd ..
			rm -rf memcache-3.0.9-dev
			rm -f memcache-3.0.9-dev.zip
		else
			wget -c $download_Url/src/memcache-2.2.7.tgz -T 5
			tar -zxvf memcache-2.2.7.tgz
			cd memcache-2.2.7
			/opt/slemp/server/php/$version/bin/phpize
			./configure  --with-php-config=/opt/slemp/server/php/$version/bin/php-config --enable-memcache --with-zlib-dir
			make && make install
			cd ..
			rm -rf memcache*
		fi
	fi

	if [ ! -f "$extFile" ];then
		echo 'error';
		exit 0;
	fi

	echo "extension=memcache.so" >> /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}


Uninstall_memcache()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'memcache.so'`
	if [ "${isInstall}" = "" ];then
		echo "php-$vphp not install memcache, Plese select other version!"
		return
	fi

	sed -i '/memcache.so/d' /opt/slemp/server/php/$version/etc/php.ini
	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}

actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_memcache
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_memcache
fi
