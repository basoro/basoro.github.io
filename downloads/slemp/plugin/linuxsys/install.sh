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

pluginPath=/opt/slemp/server/panel/plugin/linuxsys


Install_linuxsys()
{
	mkdir -p $pluginPath
	echo 'Installing script file...' > $install_tmp
	wget -O $pluginPath/linuxsys_main.py $download_Url/plugin/linuxsys/linuxsys_main.py -T 5
	wget -O $pluginPath/index.html $download_Url/plugin/linuxsys/index.html -T 5
	wget -O $pluginPath/info.json $download_Url/plugin/linuxsys/info.json -T 5
	echo 'The installation is complete' > $install_tmp
}

Uninstall_linuxsys()
{
	rm -rf $pluginPath
}


action=$1
if [ "${1}" == 'install' ];then
	Install_linuxsys
else
	Uninstall_linuxsys
fi
