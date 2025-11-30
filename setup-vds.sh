#!/bin/bash

# VDS Initial Setup Script
# Bu script'i ilk kurulum için kullanın
# Kullanım: chmod +x setup-vds.sh && ./setup-vds.sh

set -e

echo "🚀 VDS Setup başlatılıyor..."

# Proje dizini
read -p "Proje dizinini girin (örn: /var/www/loegs): " PROJECT_DIR
PROJECT_DIR=${PROJECT_DIR:-/var/www/loegs}

echo "📁 Proje dizini: $PROJECT_DIR"

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo "❌ Node.js bulunamadı. Lütfen Node.js 18+ yükleyin."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js versiyonu: $NODE_VERSION"

# PM2 kontrolü
if ! command -v pm2 &> /dev/null; then
    echo "📦 PM2 yükleniyor..."
    npm install -g pm2
else
    echo "✅ PM2 zaten yüklü"
fi

# Nginx kontrolü
if ! command -v nginx &> /dev/null; then
    echo "⚠️  Nginx bulunamadı. Lütfen manuel olarak yükleyin:"
    echo "   sudo apt-get install nginx  # Debian/Ubuntu"
    echo "   sudo yum install nginx        # CentOS/RHEL"
else
    echo "✅ Nginx yüklü"
fi

# Proje dizinine git
cd "$PROJECT_DIR" || {
    echo "❌ Proje dizini bulunamadı: $PROJECT_DIR"
    exit 1
}

# Dependencies yükle
echo "📦 Dependencies yükleniyor..."
npm install

# Environment variables kontrolü
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local dosyası bulunamadı. Oluşturuluyor..."
    cat > .env.local << EOF
# Admin Panel Credentials
ADMIN_EMAIL=admin@loegs.com
ADMIN_PASSWORD=CHANGE_THIS_PASSWORD

# JWT Secret (Güçlü bir random string oluşturun)
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Environment
NODE_ENV=production

# Domain
DOMAIN=loegs.com

# Port
PORT=3000
EOF
    echo "✅ .env.local dosyası oluşturuldu. Lütfen ADMIN_PASSWORD'ü değiştirin!"
    echo "   nano .env.local"
else
    echo "✅ .env.local dosyası mevcut"
fi

# File permissions
echo "🔐 File permissions ayarlanıyor..."
mkdir -p public/uploads
mkdir -p logs

# lib/data.json permissions
if [ -f lib/data.json ]; then
    chmod 664 lib/data.json
    echo "✅ lib/data.json permissions ayarlandı"
fi

# public/uploads permissions
chmod 755 public/uploads
echo "✅ public/uploads permissions ayarlandı"

# logs permissions
chmod 755 logs
echo "✅ logs permissions ayarlandı"

# Ecosystem config güncelle
if [ -f ecosystem.config.js ]; then
    sed -i "s|/path/to/your/project|$PROJECT_DIR|g" ecosystem.config.js
    echo "✅ ecosystem.config.js güncellendi"
fi

# Build
echo "🔨 Production build yapılıyor..."
npm run build

echo ""
echo "✅ Setup tamamlandı!"
echo ""
echo "📝 Sonraki adımlar:"
echo "1. .env.local dosyasını düzenleyin ve ADMIN_PASSWORD'ü değiştirin"
echo "2. Nginx config dosyasını ayarlayın (nginx.conf.example'ı kullanın)"
echo "3. SSL sertifikası kurun (Let's Encrypt önerilir)"
echo "4. PM2 ile uygulamayı başlatın: pm2 start ecosystem.config.js"
echo "5. PM2'yi kaydedin: pm2 save && pm2 startup"
echo ""
echo "📚 Detaylı bilgi için VDS_DEPLOYMENT.md dosyasına bakın"

