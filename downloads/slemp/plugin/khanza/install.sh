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

pluginPath=/opt/slemp/server/panel/plugin/khanza

Install_Khanza()
{
	mkdir -p $pluginPath
	echo 'Installing script file...' > $install_tmp
	wget -O $pluginPath/khanza_main.py $download_Url/plugin/khanza/khanza_main.py -T 5
	wget -O $pluginPath/index.html $download_Url/plugin/khanza/index.html -T 5
	wget -O $pluginPath/info.json $download_Url/plugin/khanza/info.json -T 5
	echo 'The installation is complete' > $install_tmp


}

Uninstall_Khanza()
{
	rm -rf $pluginPath
}


action=$1
if [ "${1}" == 'install' ];then
	Install_Khanza
else
	Uninstall_Khanza
fi
