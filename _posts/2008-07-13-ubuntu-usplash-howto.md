---
title: "Ubuntu Usplash Howto"
layout: post
date: 2008-07-13 20:24
tag:
- linux
- ubuntu
image: /assets/images/profile.jpg
headerImage: true
category: blog
author: basoro
description: "Ubuntu usplash howto"
---

Masih ingat dalam ingatan saya kalau pernah posting di milis ubuntu-id perihal usplash yang gak sempurna di Aspire 4520 saya. Dari hasil googling dan baca-baca di ubuntuforums.org, ternyata Aspire tidak support untuk frambuffer resolusi 1280x800. Mau tidak mau terpaksa harus membuat sendiri usplash yang disesuailan dengan resolusi Aspire saya. Sebagai catatan Acer Aspire 4520 tidak mendukung fb 1280x800 dari infromasi pake <em>hwinfo</em>.

Pertama, yang saya lakukan adalah membuat gambar dengan ukuran 1280x800 di Inkscape. Lalu saya perkecil ukurannya menjadi 1024x768. Ini untuk menyiasati agar hasil dari usplash.so yang dibuat menjadi sempurna, tidak memanjang seperti biasanya. Selanjutnya export hasil gambar tadi ke format .png. Kemudian edit lagi di Gimp untuk membuat gambar yang dibuat tadi sebagai gambar dengan mode indexed bukan RGB. Simpan gambar.

Kedua, buat folder usplash di /usr/local/src agar kemudian bisa kita pake lagi. Salin <a title="Usplash" href="http://www.basoro.com/wp/wp-content/uploads/usplash.zip" target="_blank">file usplash.zip</a> ke folder tersebut. Kemudia lakukan salin juga gambar yang sudah dibuat tadi ke folder dan ganti nama berkas-nya dengan nama usplash.png.

Ketiga, lakukan compile code sumber dari usplash.zip tadi untuk membuat file binary usplash.so dengan langkah sebagai berikut.

{% highlight raw %}

sudo pngtousplash usplash.png > usplash.c

sudo pngtousplash throbber_back.png > throbber_back.c

sudo pngtousplash throbber_fore.png > throbber_fore.c

sudo gcc -g -Wall -fPIC -o usplash.o -c usplash.c

sudo gcc -g -Wall -fPIC -o throbber_back.o -c throbber_back.c

sudo gcc -g -Wall -fPIC -o throbber_fore.o -c throbber_fore.c

sudo gcc -g -Wall -fPIC -o usplash-theme.o -c usplash-theme.c

sudo gcc -g -Wall -fPIC -shared -o usplash.so *.o

{% endhighlight %}

Keempat, install program startupmanager untuk merubah usplash default ubuntu dengan usplash yang sudah dibuat tadi. Terus restart mesin ubuntu anda untuk melihat hasilnya. Semoga membantu.
