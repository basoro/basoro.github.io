#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
Install_xcache()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'xcache.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	wget http://xcache.lighttpd.net/pub/Releases/3.2.0/xcache-3.2.0.tar.gz
	tar zxvf xcache-3.2.0.tar.gz
	cd xcache-3.2.0

	/opt/slemp/server/php/$version/bin/phpize
	./configure --enable-xcache--enable-xcache-coverager --enable-xcache-optimizer --with-php-config=/opt/slemp/server/php/$version/bin/php-config
	make && make install
	touch /tmp/xcache_${version}
	chmod 777 /tmp/xcache_${version}
	mv -f htdocs /opt/slemp/wwwroot/xcache
	sed -i "s#en-us#zh-cn#" /opt/slemp/wwwroot/xcache/coverager/index.php
	sed -i "s#;xcache#[xcache-common]\nextension = xcache.so\n[xcache.admin]\nxcache.admin.enable_auth = off\nxcache.admin.user = \"admin\"\nxcache.admin.pass = \"e10adc3949ba59abbe56e057f20f883e\"\n\n[xcache]\nxcache.shm_scheme =\"mmap\"\nxcache.size=60M\nxcache.count =1\nxcache.slots =8K\nxcache.ttl=0\nxcache.gc_interval =0\nxcache.var_size=64M\nxcache.var_count =1\nxcache.var_slots =8K\nxcache.var_ttl=0\nxcache.var_maxttl=0\nxcache.var_gc_interval =300\nxcache.test =Off\nxcache.readonly_protection = On\nxcache.mmap_path =\"/tmp/xcache_${version}\"\nxcache.coredump_directory =""\nxcache.cacher =On\nxcache.stat=On\nxcache.optimizer =Off\n[xcache.coverager]\nxcache.coverager =On\nxcache.coveragedump_directory =\"\"#" /opt/slemp/server/php/$version/etc/php.ini
	/etc/init.d/php-fpm-$version reload
	cd ..
	rm -rf xcache*
	echo '============================================================================='
	echo 'Instalasi sukses!'
	echo 'Untuk melihat status kerja xcache, tambahkan situs web ke panel;'
	echo "Pilih versi PHP: $version, direktori root diatur ke /opt/slemp/wwwroot/xcache"
	echo '============================================================================='
}

Uninstall_xcache()
{
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'xcache.so'`
	if [ "${isInstall}" = "" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	sed -i '/xcache/d' /opt/slemp/server/php/$version/etc/php.ini
	echo -e ";xcache" >> /opt/slemp/server/php/$version/etc/php.ini
	/etc/init.d/php-fpm-$version reload

	echo '=================================================='
	echo 'successful!'
}

actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_xcache
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_xcache
fi
