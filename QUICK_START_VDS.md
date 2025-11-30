# 🚀 VDS Quick Start Guide

VDS üzerinde hızlı kurulum için bu rehberi takip edin.

## ⚡ Hızlı Kurulum (5 Dakika)

### 1. Projeyi VDS'e Yükleyin

```bash
# Proje dizinini oluşturun
sudo mkdir -p /var/www/loegs
cd /var/www/loegs

# Projeyi yükleyin (Git, SCP, FTP vb.)
git clone <your-repo-url> .
# veya dosyaları manuel olarak yükleyin
```

### 2. Setup Script'ini Çalıştırın

```bash
chmod +x setup-vds.sh
./setup-vds.sh
```

Script otomatik olarak:
- ✅ Node.js ve PM2 kontrolü yapar
- ✅ Dependencies yükler
- ✅ .env.local dosyası oluşturur
- ✅ File permissions ayarlar
- ✅ Production build yapar

### 3. Environment Variables Ayarlayın

```bash
nano .env.local
```

**MUTLAKA DEĞİŞTİRİN:**
- `ADMIN_PASSWORD`: Güçlü bir şifre
- `JWT_SECRET`: Zaten otomatik oluşturuldu, değiştirmenize gerek yok

### 4. PM2 ile Başlatın

```bash
# PM2 config'i düzenleyin (cwd yolunu kontrol edin)
nano ecosystem.config.js

# PM2 ile başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Sistem açılışında otomatik başlatma
```

### 5. Nginx Ayarlayın

```bash
# Nginx config dosyasını oluşturun
sudo nano /etc/nginx/sites-available/loegs.com
```

`nginx.conf.example` dosyasındaki içeriği kopyalayın ve:
- `/path/to/your/project` → `/var/www/loegs` olarak değiştirin

```bash
# Symlink oluşturun
sudo ln -s /etc/nginx/sites-available/loegs.com /etc/nginx/sites-enabled/

# Test edin
sudo nginx -t

# Nginx'i yeniden başlatın
sudo systemctl restart nginx
```

### 6. SSL Sertifikası (Let's Encrypt)

```bash
# Certbot yükle
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d loegs.com -d www.loegs.com

# Nginx config'deki SSL yorumlarını kaldırın
sudo nano /etc/nginx/sites-available/loegs.com
```

### 7. Firewall Ayarları

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## ✅ Test Edin

1. **Siteyi açın:** https://loegs.com
2. **Admin panele girin:** https://loegs.com/admin
3. **Bir değişiklik yapıp kaydedin**
4. **Kaydetme işleminin çalıştığını doğrulayın**

## 🔄 Güncelleme

Yeni bir deployment için:

```bash
cd /var/www/loegs
./deploy.sh
```

## 📊 Monitoring

```bash
# PM2 status
pm2 status

# Logs
pm2 logs loegs-portfolio

# Real-time monitoring
pm2 monit
```

## 🆘 Sorun Giderme

### Admin Panel'de Kaydetme Çalışmıyor

1. **File permissions kontrolü:**
   ```bash
   ls -la lib/data.json
   # 664 olmalı
   chmod 664 lib/data.json
   ```

2. **PM2 logs kontrolü:**
   ```bash
   pm2 logs loegs-portfolio --lines 100
   ```

3. **Environment variables:**
   ```bash
   pm2 env loegs-portfolio
   ```

4. **Cookie kontrolü:**
   - Browser DevTools → Application → Cookies
   - `admin-token` cookie'si `.loegs.com` domain'inde olmalı
   - `Secure` flag aktif olmalı (HTTPS'de)

### Nginx 502 Bad Gateway

```bash
# Next.js çalışıyor mu?
pm2 status

# Port kontrolü
sudo lsof -i :3000

# Nginx config kontrolü
sudo nginx -t
```

### Port Kullanımda

```bash
# Port 3000'i kullanan process'i bul
sudo lsof -i :3000

# Farklı port kullan (ecosystem.config.js'de PORT değiştir)
```

## 📝 Önemli Notlar

1. **File Permissions:**
   - `lib/data.json`: 664 (yazılabilir)
   - `public/uploads`: 755 (yazılabilir dizin)

2. **Environment Variables:**
   - `.env.local` dosyası asla Git'e commit edilmemeli
   - Production'da güvenli bir şekilde saklanmalı

3. **SSL:**
   - HTTPS zorunlu (cookie secure flag için)
   - Let's Encrypt otomatik yenileme yapıyor

4. **PM2:**
   - `pm2 save` ile process listesini kaydedin
   - `pm2 startup` ile sistem açılışında otomatik başlatın

## 📚 Detaylı Dokümantasyon

Daha detaylı bilgi için `VDS_DEPLOYMENT.md` dosyasına bakın.

