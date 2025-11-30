#!/bin/bash

# VDS Deployment Script for loegs.com
# Kullanım: chmod +x deploy.sh && ./deploy.sh

set -e  # Hata durumunda dur

echo "🚀 Starting deployment..."

# Proje dizini (kendi yolunuza göre değiştirin)
PROJECT_DIR="/path/to/your/project"
cd $PROJECT_DIR

# Git pull (eğer git kullanıyorsanız)
echo "📥 Pulling latest changes..."
# git pull origin main

# Dependencies yükle
echo "📦 Installing dependencies..."
npm ci --production=false

# Build
echo "🔨 Building application..."
npm run build

# File permissions kontrolü
echo "🔐 Setting file permissions..."
# lib/data.json dosyasının yazılabilir olduğundan emin ol
chmod 664 lib/data.json
chown $USER:$USER lib/data.json

# public/uploads dizininin yazılabilir olduğundan emin ol
mkdir -p public/uploads
chmod 755 public/uploads
chown -R $USER:$USER public/uploads

# PM2 restart
echo "🔄 Restarting PM2..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# PM2 save
pm2 save

echo "✅ Deployment completed!"
echo "📊 Check status with: pm2 status"
echo "📝 Check logs with: pm2 logs loegs-portfolio"

