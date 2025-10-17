#!/usr/bin/env bash
set -e

echo
echo "=========================================="
echo "🚀  MLITE Docker Auto Installer"
echo "=========================================="
echo

# Pastikan dependencies tersedia
if ! command -v curl >/dev/null 2>&1; then
  echo "❌ curl tidak ditemukan. Silakan install terlebih dahulu."
  exit 1
fi

if ! command -v unzip >/dev/null 2>&1; then
  echo "📦 Menginstall unzip..."
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -qq && apt-get install -yqq unzip
  elif command -v yum >/dev/null 2>&1; then
    yum install -y unzip
  elif command -v apk >/dev/null 2>&1; then
    apk add --no-cache unzip
  else
    echo "❌ Tidak dapat menginstal unzip (package manager tidak dikenali)."
    exit 1
  fi
fi

# Download repository dari GitHub
echo
echo "⬇️  Mengunduh MLITE dari GitHub..."
curl -L -o mlite.zip https://github.com/basoro/mlite/archive/refs/heads/master.zip

# Ekstrak file ZIP
echo
echo "📂 Mengekstrak mlite.zip..."
rm -rf mlite-master mlite
unzip -q mlite.zip
rm -f mlite.zip

# Rename folder mlite-master menjadi mlite
echo
echo "🔄 Mengubah nama folder mlite-master menjadi mlite..."
mv mlite-master mlite

# Masuk ke direktori docker
echo
echo "📁 Masuk ke direktori mlite/docker..."
cd mlite/docker || { echo "❌ Folder docker tidak ditemukan!"; exit 1; }

# Jalankan installer Docker di dalam folder docker
if [ -f install.sh ]; then
  echo
  echo "⚙️  Menjalankan bash install.sh..."
  bash install.sh
else
  echo "❌ File install.sh tidak ditemukan di folder docker."
  exit 1
fi

echo
echo "✅ MLITE Docker berhasil dijalankan!"
