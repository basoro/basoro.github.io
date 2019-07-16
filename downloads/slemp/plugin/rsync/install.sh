#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
install_tmp='/tmp/slemp_install.pl'
download_Url=https://basoro.id/downloads/slemp
public_file=/opt/slemp/server/panel/script/public.sh
if [ ! -f $public_file ];then
	wget -O $public_file $download_Url/public.sh -T 5;
fi
. $public_file
pluginPath=/opt/slemp/server/panel/plugin/rsync
dataPath=/opt/slemp/server/panel/data
centos=1
if [ ! -f /usr/bin/yum ];then
	centos=0
fi

Install_rsync()
{
	check_fs
	check_package

	wget -O /etc/init.d/rsynd $download_Url/plugin/rsync/rsynd.init -T 5
	chmod +x /etc/init.d/rsynd
	if [ $centos == 1 ];then
		chkconfig --add rsynd
		chkconfig --level 2345 rsynd on
	else
		update-rc.d rsynd defaults
	fi

	wget -O /etc/init.d/lsyncd $download_Url/plugin/rsync/lsyncd.init -T 5
	chmod +x /etc/init.d/lsyncd
	if [ $centos == 1 ];then
		chkconfig --add lsyncd
		chkconfig --level 2345 lsyncd on
	else
		update-rc.d lsyncd defaults
	fi

	mkdir -p $pluginPath
	echo 'Installing script file...' > $install_tmp
	wget -O $pluginPath/rsync_main.py $download_Url/plugin/rsync/rsync_main.py -T 5
	wget -O $pluginPath/rsync_init.py $download_Url/plugin/rsync/rsync_init.py -T 5
	wget -O $pluginPath/index.html $download_Url/plugin/rsync/index.html -T 5
	wget -O $pluginPath/info.json $download_Url/plugin/rsync/info.json -T 5
	#if [ ! -f $dataPath/userInfo.json ];then
	#	wget -O $dataPath/userInfo.json $download_Url/plugin/rsync/userInfo.json -T 5
	#fi
	#if [ ! -f $pluginPath/config.json ];then
	wget -O $pluginPath/config.json $download_Url/plugin/rsync/config.json -T 5
	#fi
	python -m compileall $pluginPath/rsync_init.py

	echo 'The installation is complete' > $install_tmp
	python $pluginPath/rsync_main.py new
	if [ -f $pluginPath/rsync_init.pyc ];then
		rm -f $pluginPath/rsync_init.py
	fi
}

check_package()
{
	if [ $centos == 1 ];then
		isInstall=`rpm -qa |grep lua-devel`
		if [ "$isInstall" == "" ];then
			yum install lua lua-devel asciidoc cmake -y
		fi
	else
		isInstall=`dpkg -l|grep liblua5.1-0-dev`
		if [ "$isInstall" == "" ];then
			apt-get install lua5.1 lua5.1-dev cmake -y
		fi
	fi

	if [ -f /usr/local/lib/lua/5.1/cjson.so ];then
		if [ -d "/usr/lib64/lua/5.1" ];then
			ln -sf /usr/local/lib/lua/5.1/cjson.so /usr/lib64/lua/5.1/cjson.so
		fi

		if [ -d "/usr/lib/lua/5.1" ];then
			ln -sf /usr/local/lib/lua/5.1/cjson.so /usr/lib/lua/5.1/cjson.so
		fi
	fi
	rconf=`cat /etc/rsyncd.conf|grep 'rsyncd.pid'`
	if [ "$rconf" == "" ];then
		cat > /etc/rsyncd.conf <<EOF
uid = root
use chroot = no
dont compress = *.gz *.tgz *.zip *.z *.Z *.rpm *.deb *.bz2 *.mp4 *.avi *.swf *.rar
hosts allow =
max connections = 200
gid = root
timeout = 600
lock file = /var/run/rsync.lock
pid file = /var/run/rsyncd.pid
log file = /var/log/rsyncd.log
port = 873
EOF
	fi

	rsync_version=`/usr/bin/rsync --version|grep version|awk '{print $3}'`
	if [ "$rsync_version" != "3.1.2" ] &&  [ "$rsync_version" != "3.1.3" ];then
		wget -O rsync-3.1.3.tar.gz $download_Url/src/rsync-3.1.3.tar.gz -T 20
		tar xvf rsync-3.1.3.tar.gz
		cd rsync-3.1.3
		./configure --prefix=/usr
		make
		make install
		cd ..
		rm -rf rsync-3.1.3*
		rsync_version=`/usr/bin/rsync --version|grep version|awk '{print $3}'`
		if [ "$rsync_version" != "3.1.3" ];then
			rm -f /usr/bin/rsync
			ln -sf /usr/local/bin/rsync /usr/bin/rsync
		fi
	fi

	lsyncd_version=`lsyncd --version |grep Version|awk '{print $2}'`
	if [ "$lsyncd_version" != "2.2.2" ];then
		wget -O lsyncd-release-2.2.2.zip $download_Url/src/lsyncd-release-2.2.2.zip -T 20
		unzip lsyncd-release-2.2.2.zip
		cd lsyncd-release-2.2.2
		cmake -DCMAKE_INSTALL_PREFIX=/usr
		make
		make install
		cd ..
		rm -rf lsyncd-release-2.2.2*
		if [ ! -f /etc/lsyncd.conf ];then
			echo > /etc/lsyncd.conf
		fi
	fi
}


check_fs()
{
	is_max_user_instances=`cat /etc/sysctl.conf|grep max_user_instances`
	if [ "$is_max_user_instances" == "" ];then
		echo "fs.inotify.max_user_instances = 1024" >> /etc/sysctl.conf
		echo "1024" > /proc/sys/fs/inotify/max_user_instances
	fi

	is_max_user_watches=`cat /etc/sysctl.conf|grep max_user_watches`
	if [ "$is_max_user_watches" == "" ];then
		echo "fs.inotify.max_user_watches = 819200" >> /etc/sysctl.conf
		echo "819200" > /proc/sys/fs/inotify/max_user_watches
	fi
}

Uninstall_rsync()
{
	/etc/init.d/rsynd stop
	if [ $centos == 1 ];then
		chkconfig --del rsynd
	else
		update-rc.d -f rsynd remove
	fi
	rm -f /etc/init.d/rsynd

	if [ -f /etc/init.d/rsync_inotify ];then
		/etc/init.d/rsync_inotify stopall
		chkconfig --del rsync_inotify
		rm -f /etc/init.d/rsync_inotify
	fi

	if [ -f /etc/init.d/lsyncd ];then
		/etc/init.d/lsyncd stop
		if [ $centos == 1 ];then
			chkconfig --level 2345 lsyncd off
			chkconfig --del rsynd
		else
			update-rc.d -f rsynd remove
		fi
	else
		systemctl disable lsyncd
		systemctl stop lsyncd
	fi

	rm -f /etc/lsyncd.conf
	rm -f /etc/rsyncd.conf
	rm -rf $pluginPath
}

if [ "${1}" == 'install' ];then
	Install_rsync
	rm -rf /opt/slemp/server/panel/plugin/rsyncsecrets
elif [ "${1}" == 'uninstall' ];then
	Uninstall_rsync
	rm -rf /opt/slemp/server/panel/plugin/rsyncsecrets
fi
