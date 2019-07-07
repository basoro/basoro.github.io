#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

. /opt/slemp/server/panel/script/public.sh
download_Url=https://basoro.id/downloads/slemp

redis_version=5.0.3
runPath=/root
node_Check(){
	download_Url=https://basoro.id/downloads/slemp
}
Service_On(){
	if [ -f "/usr/bin/yum" ];then
		chkconfig --add redis
		chkconfig --level 2345 redis on
	elif [ -f "/usr/bin/apt" ]; then
		update-rc.d redis defaults
	fi
}
Service_Off(){
	if [ -f "/usr/bin/yum" ];then
		chkconfig --del redis
		chkconfig --level 2345 redis off
	elif [ -f "/usr/bin/apt" ]; then
		update-rc.d redis remove
	fi
}

ext_Path(){
	case "${version}" in
		'56')
		extFile='/opt/slemp/server/php/56/lib/php/extensions/no-debug-non-zts-20131226/redis.so'
		;;
		'70')
		extFile='/opt/slemp/server/php/70/lib/php/extensions/no-debug-non-zts-20151012/redis.so'
		;;
		'71')
		extFile='/opt/slemp/server/php/71/lib/php/extensions/no-debug-non-zts-20160303/redis.so'
		;;
		'72')
		extFile='/opt/slemp/server/php/72/lib/php/extensions/no-debug-non-zts-20170718/redis.so'
		;;
		'73')
		extFile='/opt/slemp/server/php/73/lib/php/extensions/no-debug-non-zts-20180731/redis.so'
		;;
	esac
}
Install_Redis()
{
	cpunum=`cat /proc/cpuinfo| grep "processor"| wc -l`
	if [ "$cpunum" -ne "1" ];then
		cpunum=`expr $cpunum - 1`
	fi
	node_Check
    if [ ! -f '/opt/slemp/server/redis/src/redis-server' ];then
    	cd /opt/slemp/server
		wget $download_Url/src/redis-$redis_version.tar.gz -T 5
		tar zxvf redis-$redis_version.tar.gz
		mv redis-$redis_version redis
		cd redis
		make -j $cpunum

		echo "#!/bin/sh
# chkconfig: 2345 56 26
# description: Redis Service

### BEGIN INIT INFO
# Provides:          Redis
# Required-Start:    \$all
# Required-Stop:     \$all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts Redis
# Description:       starts the BT-Web
### END INIT INFO

# Simple Redis init.d script conceived to work on Linux systems
# as it does use of the /proc filesystem.

CONF=\"/opt/slemp/server/redis/redis.conf\"
REDISPORT=\$(cat \$CONF |grep port|grep -v '#'|awk '{print \$2}')
REDISPASS=\$(cat \$CONF |grep requirepass|grep -v '#'|awk '{print \$2}')
if [ \"\$REDISPASS\" != \"\" ];then
	REDISPASS=\" -a \$REDISPASS\"
fi
if [ -f "/opt/slemp/server/redis/start.pl" ];then
	STARPORT=\$(cat /opt/slemp/server/redis/start.pl)
else
	STARPORT="6379"
fi
EXEC=/opt/slemp/server/redis/src/redis-server
CLIEXEC=\"/opt/slemp/server/redis/src/redis-cli -p \$STARPORT\$REDISPASS\"
PIDFILE=/var/run/redis_6379.pid

redis_start(){
	if [ -f \$PIDFILE ]
	then
			echo \"\$PIDFILE exists, process is already running or crashed\"
	else
			echo \"Starting Redis server...\"
			nohup \$EXEC \$CONF >> /opt/slemp/server/redis/logs.pl 2>&1 &
			echo \${REDISPORT} > /opt/slemp/server/redis/start.pl
	fi
}
redis_stop(){
	if [ ! -f \$PIDFILE ]
	then
			echo \"\$PIDFILE does not exist, process is not running\"
	else
			PID=\$(cat \$PIDFILE)
			echo \"Stopping ...\"
			\$CLIEXEC shutdown
			while [ -x /proc/\${PID} ]
			do
				echo \"Waiting for Redis to shutdown ...\"
				sleep 1
			done
			echo \"Redis stopped\"
	fi
}


case \"\$1\" in
    start)
		redis_start
        ;;
    stop)
        redis_stop
        ;;
	restart|reload)
		redis_stop
		sleep 0.3
		redis_start
		;;
    *)
        echo \"Please use start or stop as first argument\"
        ;;
esac
" > /etc/init.d/redis

		ln -sf /opt/slemp/server/redis/src/redis-cli /usr/bin/redis-cli
		chmod +x /etc/init.d/redis

		v=`cat /opt/slemp/server/panel/class/common.py|grep "g.version = "|awk -F "'" '{print $2}'|awk -F "." '{print $1}'`
		if [ "$v" -ge "6" ];then
			pluginPath=/opt/slemp/server/panel/plugin/redis
			mkdir -p $pluginPath
			wget -O $pluginPath/redis_main.py $download_Url/install/plugin/redis/redis_main.py -T 5
			wget -O $pluginPath/index.html $download_Url/install/plugin/redis/index.html -T 5
			wget -O $pluginPath/info.json $download_Url/install/plugin/redis/info.json -T 5
			wget -O $pluginPath/icon.png $download_Url/install/plugin/redis/icon.png -T 5
		fi

		sed -i 's/dir .\//dir \/opt\/slemp\/server\/redis\//g' /opt/slemp/server/redis/redis.conf

		Service_On
		/etc/init.d/redis start
		rm -f /opt/slemp/server/redis-$redis_version.tar.gz
		cd $runPath
		echo $redis_version > /opt/slemp/server/redis/version.pl
	fi

	if [ ! -d /opt/slemp/server/php/$version ];then
		return;
	fi

	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'redis.so'`
	if [ "${isInstall}" != "" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	ext_Path

	if [ ! -f "${extFile}" ];then
		rVersion='4.2.0'

		wget $download_Url/src/redis-$rVersion.tgz -T 5
		tar zxvf redis-$rVersion.tgz
		rm -f redis-$rVersion.tgz
		cd redis-$rVersion
		/opt/slemp/server/php/$version/bin/phpize
		./configure --with-php-config=/opt/slemp/server/php/$version/bin/php-config
		make && make install
		cd ../
		rm -rf redis-$rVersion*
	fi

	if [ ! -f "${extFile}" ];then
		echo 'error';
		exit 0;
	fi

	echo -e "\n[redis]\nextension = ${extFile}\n" >> /opt/slemp/server/php/$version/etc/php.ini

	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}

Uninstall_Redis()
{
	if [ ! -d /opt/slemp/server/php/$version/bin ];then
		pkill -9 redis
		rm -f /var/run/redis_6379.pid
		Service_Off
		rm -f /usr/bin/redis-cli
		rm -f /etc/init.d/redis
		rm -rf /opt/slemp/server/redis
		rm -rf /opt/slemp/server/panel/plugin/redis
		return;
	fi
	if [ ! -f "/opt/slemp/server/php/$version/bin/php-config" ];then
		echo "php-$vphp not install, Plese select other version!"
		return
	fi

	isInstall=`cat /opt/slemp/server/php/$version/etc/php.ini|grep 'redis.so'`
	if [ "${isInstall}" = "" ];then
		echo "php-$vphp not install Redis, Plese select other version!"
		return
	fi

	sed -i '/redis.so/d' /opt/slemp/server/php/$version/etc/php.ini

	service php-fpm-$version reload
	echo '==============================================='
	echo 'successful!'
}
Update_redis(){
	node_Check
	cd /opt/slemp/server
	wget $download_Url/src/redis-$redis_version.tar.gz -T 5
	tar zxvf redis-$redis_version.tar.gz
	rm -f redis-$redis_version.tar.gz
	mv redis-$redis_version redis2
	cd redis2
	make
	/etc/init.d/redis stop
	sleep 1
	cd ..
	mv /opt/slemp/server/redis /opt/slemp/server/redisBak
	mv redis2 redis
	rm -f /usr/bin/redis-cli
	ln -sf /opt/slemp/server/redis/src/redis-cli /usr/bin/redis-cli
	/etc/init.d/redis start
	rm -f /opt/slemp/server/redis/version_check.pl
	echo $redis_version > /opt/slemp/server/redis/version.pl
}
actionType=$1
version=$2
vphp=${version:0:1}.${version:1:1}
if [ "$actionType" == 'install' ];then
	Install_Redis
elif [ "$actionType" == 'uninstall' ];then
	Uninstall_Redis
elif [ "${actionType}" == "update" ]; then
	Update_redis
fi
