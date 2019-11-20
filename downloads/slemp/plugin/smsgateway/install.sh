#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
download_Url=https://basoro.id/downloads/slemp
install_tmp='/tmp/slemp_install.pl'
public_file=/opt/slemp/server/panel/script/public.sh
if [ ! -f $public_file ];then
	wget -O $public_file $download_Url/public.sh -T 5;
fi
. $public_file

pluginPath=/opt/slemp/server/panel/plugin/smsgateway

centos=1
if [ ! -f /usr/bin/yum ];then
	centos=0
fi

Install_Smsgateway()
{
	if [ $centos == 1 ];then
	  yum install gammu gammu-smsd -y
	else
		apt-get install gammu gammu-smsd -y
  fi
	mkdir -p $pluginPath
	echo 'Installing script file...' > $install_tmp
	wget -O $pluginPath/smsgateway_main.py $download_Url/plugin/smsgateway/smsgateway_main.py -T 5
	wget -O $pluginPath/index.html $download_Url/plugin/smsgateway/index.html -T 5
	wget -O $pluginPath/info.json $download_Url/plugin/smsgateway/info.json -T 5
	#wget -O $pluginPath/gammu_script.sh $download_Url/plugin/smsgateway/gammu_script.sh -T 5
	#wget -O $pluginPath/sms-config.php $download_Url/plugin/smsgateway/sms-config.php -T 5
	#wget -O $pluginPath/sms-run.php $download_Url/plugin/smsgateway/sms-run.php -T 5
	mv /etc/gammu-smsdrc /etc/gammu-smsdrc.original
	wget -O /etc/gammu-smsdrc  $download_Url/plugin/smsgateway/gammu-smsdrc  -T 5
	echo 'The installation is complete' > $install_tmp


}

Uninstall_Smsgateway()
{
	rm -rf $pluginPath
}


action=$1
if [ "${1}" == 'install' ];then
	Install_Smsgateway
else
	Uninstall_Smsgateway
fi
