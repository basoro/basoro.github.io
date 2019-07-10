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

pluginPath=/opt/slemp/server/panel/masterslave

Install_masterslave()
{
	isbt_pcre=`rpm -qa|grep bt-pcre`
	if [ "$isbt_pcre" != '' ];then
		rpm -e bt-pcre;
		yum reinstall pcre -y;
	fi
	mkdir -p $pluginPath
	echo 'Installing script file...' > $install_tmp
	wget -O $pluginPath/masterslave_main.py $download_Url/plugin/masterslave/masterslave_main.py -T 5
	wget -O $pluginPath/index.html $download_Url/plugin/masterslave/index.html -T 5
	wget -O $pluginPath/info.json $download_Url/plugin/masterslave/info.json -T 5
	echo 'The installation is complete' > $install_tmp
}

Uninstall_masterslave()
{
	rm -rf $pluginPath
}

if [ "${1}" == 'install' ];then
	Install_masterslave
elif [ "${1}" == 'uninstall' ];then
	Uninstall_masterslave
fi
rm -f $public_file
