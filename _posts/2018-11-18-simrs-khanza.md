---
title: ":floppy_disk: SIMRS Khanza"
layout: post
commentIssueId: 14 
date: 2018-11-18 14:13
tag:
- linux
- centos
- simrs
- khanza
star: true
image: /assets/images/aski.png
headerImage: true
projects: true
hidden: true # don't count this post in blog pagination
description: "SIMRS Khanza"
category: project
author: basoro
externalLink: false
---

SIMRS Khanza adalah Software Menejemen Rumah Sakit, Klinik, Puskesmas yang gratis dan boleh digunakan siapa saja tanpa dikenai
biaya apapun. Dilarang keras memperjualbelikan atau mengambil keuntungan dari Software ini dalam bentuk apapun tanpa seijin pembuat software (<a href="https://elkhanza.wordpress.com/">Khanza.Soft Media</a>).

Berikut adalah rilis SIMRS Khanza tiap akhir bulan yang disebut sebagai <span class="final-release">Final Release</span>. Sebelum rilis stabil akhir bulan, biasanya ada perbaikan-perbaikan minor yang akan disebut <span class="pre-release">Pre-release</span>. Dalam rilis bulanan ini, sudah lengkap paket binary untuk klien dan paket bundle untuk server beserta databasenya. Untuk cara instalasi dan konfigurasi silahkan merujuk ke situs resmi <a href="https://www.yaski.or.id" target="_blank">Yaski</a>. Jika menginginkan konfigurasi server Linux yang tangguh beserta pakte SIMRS Khanza untuk Klien, silahkan merujuk ke <a href="https://basoro.github.io/slemp-simrs-khanza-centos-6/">SLEMP SIMRS Khanza Centos 6</a>

Licensi yang dianut di software ini adalah <a href="https://en.wikipedia.org/wiki/Aladdin_Free_Public_License">Aladdin Free Public License<a/>.<br> 
Informasi dan panduan bisa dicek di halaman <a href="https://github.com/mas-elkhanza/SIMRS-Khanza/wiki">Wiki SIMRS Khanza</a>.  


<h3>Last releases<span class="total-downloads"></span></h3>
<table class="table-downloads">
  <thead>
    <tr>
      <th>Release</th>
      <th>Size</th>
      <th class="none">Count</th>
      <th class="none">Date</th>
      <th class="none">Days</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>

<br>
<p align="center">
    <h1 align="center">RSHD Barabai Version</h1>
    <p align="center">Use at Your Own Risk</p>
    <p align="center"><strong><a href="https://basoro.id/SIMKES-Khanza/">Baca Dokumentasi!</a></strong></p>
    <br><br><br>
</p>

![SIMKES Khanza](https://raw.githubusercontent.com/basoro/SIMKES-Khanza/master/docs/images/simkes.gif)

<br><br>

![Plugins](https://raw.githubusercontent.com/basoro/SIMKES-Khanza/master/docs/images/plugins.jpg)

<br><br>

## Instalasi, Konfigurasi dan Fitur

### Install cara cepat

1. Download Java 12 dan Install ([Windows](https://repo.huaweicloud.com/java/jdk/12.0.1+12/jdk-12.0.1_windows-x64_bin.exe), [Linux](https://repo.huaweicloud.com/java/jdk/12.0.1+12/jdk-12.0.1_linux-x64_bin.tar.gz), [MacOS](https://repo.huaweicloud.com/java/jdk/12.0.1+12/jdk-12.0.1_osx-x64_bin.dmg))
2. Download Webserver dan Install ([Windows](https://bitnami.com/redirect/to/576576/bitnami-nginxstack-1.16.0-1-windows-x64-installer.exe), [Linux](https://bitnami.com/redirect/to/576566/bitnami-nginxstack-1.16.0-1-linux-x64-installer.run), [MacOS](https://bitnami.com/redirect/to/576570/bitnami-nginxstack-1.16.0-1-osx-x86_64-installer.dmg))
3. Download aplikasi [SIMKES Khanza](https://github.com/basoro/SIMKES-Khanza/releases)
4. Import databse sik_kosong.sql (atau sik.sql dengan dummy data)
5. Jalankan file Aplikasi (Aplikasi.bat untuk Windows dan Aplikasi.sh untuk Linux dan MacOS)
6. Tunggu sesaat, lalu klik login. Gunakan user: <b>spv</b> dan pass: <b>server</b>

### Konfigurasi
- [Lihat konfigurasi pemasangan](https:/basoro.id/SIMKES-Khanza/)
- [Lihat konfigurasi aplikasi](https:/basoro.id/SIMKES-Khanza/)

### Fitur-Fitur

1. Telah dipakai oleh ratusan rumah sakit dan klinik di seluruh Indonesia
2. Sudah banyak rumah sakit yang lulus akreditasi, memakai SIMRS Khanza
3. Fitur-fitur lengkap, mencakup semua proses bisnis rumah sakit / klinik
4. Gratis dan open source, bahkan tim IT rumah sakit bisa mengembangkan sendiri jika ada fitur yang dirasa kurang sesuai
5. Aplikasi dibuat menggunakan teknologi hybrid Java, PHP, CSS dan HTML 
6. Berbasiskan open source dengan tanpa biaya lisensi database dan tanpa batasan system operasi
7. Sudah bisa Bridging dengan sistem lain (BPJS, INACBGs, Inhealth, Dukcapil, SITT, Sisrute Dll)
8. Branchwise Enabled, mendukung multi site / multicabang dan lokasi
9. Tampilan program yang simpel dan mudah di gunakan
10. ICD Support, tersedia ICD 9 dan 10
11. Exportable, semua laporan dapat di ekspor ke Microsoft Excell
12. Memungkinkan penggunaan secara Multi User dan Multi Tasking, tanpa menimbulkan interupsi data
13. Aman, menggunakan metodologi role user untuk pemberian hak akses pada setiap user/pemakai
14. Dukungan oleh owner (Bapak Windiarto Nugroho S.Kom) dalam implementasi di berbagai tipe rumah sakit seluruh Indonesia
15. Dukungan 24 jam oleh komunitas pengguna SIMRS Khanza seluruh Indonesia 

## Pengembangan

Untuk lingkungan pengembangan, silahkan ikuti langkah-langkah berikut.

1. Install Java 12. Jika bingun, silahkan mengacu ke file di folder Google Drive Mas Win.
   https://drive.google.com/drive/folders/0ByL--Jg6bdF7RG1NSlVTT2ZPODg
2. Install Netbeans 11. Silahkan mengacu ke situs netbeans (incubating-netbeans-11.0-bin.zip)
   https://netbeans.org
3. Download atau clone https://github.com/basoro/SIMKES-Khanza/
4. Sesuaikan absolute path library-library pada file nbproject/project.properties dengan keadaan pada komputer anda (find and replace).
5. Buka Netbeans anda.
6. Open project SIMRS Khanza pada point 3.
7. Silahkan clean, build atau clean build.

Note:
Hasil build ada di folder dist. Support semua OS. Tidak perlu nambah library lagi.

---

## Tentang SIMKES Khanza

## Hak Cipta

Hak cipta SIMRS Khanza (SIMKES Khanza) oleh [Windiarto](https://raw.githubusercontent.com/basoro/SIMKES-Khanza/master/docs/images/haki-simrs-khanza.jpg).

### License

SIMKES Khanza didistribusikan dengan lisensi [Aladdin Free Public License](https://en.wikipedia.org/wiki/Aladdin_Free_Public_License)


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.js"></script>
<script src="/assets/js/simrs-khanza.js"></script>
