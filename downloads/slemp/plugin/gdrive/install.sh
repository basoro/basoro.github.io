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

pluginPath=/opt/slemp/server/panel/plugin/gdrive


Install_GDrive()
{
tmp=`python -V 2>&1|awk '{print $2}'`
pVersion=${tmp:0:3}

pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
echo 'Installing script file...' > $install_tmp
#mkdir -p /www/server/panel/plugin/gdrive
#grep "English" /www/server/panel/config/config.json
#if [ "$?" -ne 0 ];then
#	wget -O /www/server/panel/script/backup_gdrive.py $download_Url/install/plugin/gdrive/gdrive_main.py -T 5
#	\cp -a -r /www/server/panel/script/backup_gdrive.py /www/server/panel/plugin/gdrive/gdrive_main.py
#	wget -O /www/server/panel/plugin/gdrive/index.html $download_Url/install/plugin/gdrive/index.html -T 5
#	wget -O /www/server/panel/plugin/gdrive/info.json $download_Url/install/plugin/gdrive/info.json -T 5
#	wget -O /www/server/panel/plugin/gdrive/icon.png $download_Url/install/plugin/gdrive/icon.png -T 5
#	wget -O /www/server/panel/plugin/gdrive/credentials.json $download_Url/install/plugin/gdrive/credentials.json -T 5
#else
#	wget -O /www/server/panel/script/backup_gdrive.py $download_Url/install/plugin/gdrive_en/gdrive_main.py -T 5
#	\cp -a -r /www/server/panel/script/backup_gdrive.py /www/server/panel/plugin/gdrive/gdrive_main.py
#	wget -O /www/server/panel/plugin/gdrive/index.html $download_Url/install/plugin/gdrive_en/index.html -T 5
#	wget -O /www/server/panel/plugin/gdrive/info.json $download_Url/install/plugin/gdrive_en/info.json -T 5
#	wget -O /www/server/panel/plugin/gdrive/icon.png $download_Url/install/plugin/gdrive_en/icon.png -T 5
#	wget -O /www/server/panel/plugin/gdrive/credentials.json $download_Url/install/plugin/gdrive/credentials.json -T 5
#fi
#    ln -s /www/server/panel/plugin/gdrive/credentials.json /root/credentials.json

echo 'The installation is complete' > $install_tmp
}

Uninstall_GDrive()
{
	#rm -rf /www/server/panel/plugin/gdrive
	#rm -f /www/server/panel/script/backup_gdrive.py
	#echo '卸载完成' > $install_tmp
}


action=$1
if [ "${1}" == 'install' ];then
	Install_GDrive
else
	Uninstall_GDrive
fi
