#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

Remove_Slemp(){
	if [ ! -f "/etc/init.d/slemp" ] || [ ! -d "/opt/slemp/server/panel" ]; then
		echo -e "This server does not install SLEMP panel"
		exit;
	fi
	/etc/init.d/slemp stop
	if [ -f "/usr/sbin/chkconfig" ];then
		chkconfig --del slemp
	elif [ -f "/usr/sbin/update-rc.d" ];then
		/usr/sbin/update-rc.d
	fi
	rm -rf /opt/slemp/server/panel
	rm -f /etc/init.d/slemp
	echo -e "SLEMP Panel uninstall success"
}
Remove_Service(){
	servicePath="/opt/slemp/server"
	for service in nginx mysqld php-fpm-56 php-fpm-70 php-fpm-71 php-fpm-72 php-fpm-73
	do
		if [ -f "/etc/init.d/${service}" ]; then
			/etc/init.d/${service} stop
			if [ -f "/usr/sbin/chkconfig" ];then
				chkconfig  --del ${service}
			elif [ -f "/usr/sbin/update-rc.d" ];then
				update-rc.d -f ${service} remove
			fi
			if [ "${service}" = "mysqld" ]; then
			 	rm -rf ${servicePath}/mysql
			 	rm -f /etc/my.cnf
			elif [ "${service}" = "nginx" ] ; then
				rm -rf ${servicePath}/${service}
			fi
			rm -f /etc/init.d/${service}
			echo -e ${service} "\033[32mclean\033[0m"
		fi
	done
	if [ -d "${servicePath}/php" ]; then
		rm -rf ${servicePath}/php
	elif [ -d "${servicePath}/phpmyadmin" ]; then
		rm -rf ${servicePath}/phpmyadmin
	fi
}

Remove_Data(){
	rm -rf /opt/slemp/server/data
	rm -rf /opt/slemp/wwwlogs
	rm -rf /opt/slemp/wwwroot
}

echo "================================================="
#echo -e "What you want to do ?(Default:1)"
echo "1) Uninstall SLEMP Panel"
echo "2) Uninstall dan Wipe Data SLEMP Panel"
read -p "Please select the action you want to take.(1-2 Default:1): " action;
echo "================================================="

case $action in
	'1')
		Remove_Slemp
		;;
	'2')
		Remove_Service
		Remove_Slemp
		;;
	*)
		Remove_Slemp
	;;
esac

rm -f uninstall.sh
