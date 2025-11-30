# VDS Deployment Guide - loegs.com

Bu rehber, projeyi VDS (Virtual Dedicated Server) üzerinde production'a deploy etmek için gerekli tüm adımları içerir.

## 📋 Gereksinimler

- Node.js 18+ yüklü olmalı
- PM2 yüklü olmalı (`npm install -g pm2`)
- Nginx yüklü ve çalışıyor olmalı
- Domain (loegs.com) VDS IP'sine yönlendirilmiş olmalı
- SSL sertifikası (Let's Encrypt önerilir)

## 🔧 Kurulum Adımları

### 1. Projeyi VDS'e Yükleme

```bash
# Proje dizinini oluşturun
mkdir -p /var/www/loegs
cd /var/www/loegs

# Projeyi yükleyin (Git, FTP, SCP vb.)
# Örnek Git ile:
git clone <your-repo-url> .
```

### 2. Environment Variables Ayarlama

`.env.local` dosyası oluşturun:

```bash
nano .env.local
```

Aşağıdaki içeriği ekleyin:

```env
# Admin Panel Credentials
ADMIN_EMAIL=admin@loegs.com
ADMIN_PASSWORD=your-secure-password-here

# JWT Secret (Güçlü bir random string oluşturun)
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Environment
NODE_ENV=production

# Domain
DOMAIN=loegs.com

# Port (opsiyonel, varsayılan 3000)
PORT=3000

# Google Analytics (opsiyonel)
NEXT_PRIVATE_GTID=your-google-analytics-id
```

**Önemli:** JWT_SECRET için güçlü bir değer oluşturun:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Dependencies Yükleme

```bash
cd /var/www/loegs
npm install
```

### 4. PM2 Configuration

`ecosystem.config.js` dosyasını düzenleyin:

```bash
nano ecosystem.config.js
```

`cwd` değerini kendi proje yolunuza göre değiştirin:
```javascript
cwd: '/var/www/loegs',
```

### 5. File Permissions Ayarlama

```bash
# lib/data.json dosyasının yazılabilir olduğundan emin ol
chmod 664 lib/data.json
chown $USER:$USER lib/data.json

# public/uploads dizininin yazılabilir olduğundan emin ol
mkdir -p public/uploads
chmod 755 public/uploads
chown -R $USER:$USER public/uploads

# Logs dizini oluştur
mkdir -p logs
chmod 755 logs
```

### 6. Build ve Start

```bash
# Production build
npm run build

# PM2 ile başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Sistem açılışında otomatik başlatma için
```

### 7. Nginx Configuration

Nginx config dosyasını oluşturun:

```bash
sudo nano /etc/nginx/sites-available/loegs.com
```

`nginx.conf.example` dosyasındaki içeriği kopyalayın ve aşağıdaki değişiklikleri yapın:
- `/path/to/your/project` → `/var/www/loegs` (veya kendi yolunuz)
- SSL sertifikası yollarını kontrol edin

Symlink oluşturun:

```bash
sudo ln -s /etc/nginx/sites-available/loegs.com /etc/nginx/sites-enabled/
```

Nginx config'i test edin:

```bash
sudo nginx -t
```

Nginx'i yeniden başlatın:

```bash
sudo systemctl restart nginx
```

### 8. SSL Sertifikası (Let's Encrypt)

```bash
# Certbot yükle (Debian/Ubuntu)
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d loegs.com -d www.loegs.com

# Otomatik yenileme testi
sudo certbot renew --dry-run
```

SSL kurulduktan sonra Nginx config'deki SSL yorumlarını kaldırın.

### 9. Firewall Ayarları

```bash
# UFW kullanıyorsanız
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 🔄 Deployment Script Kullanımı

Deployment script'ini düzenleyin:

```bash
nano deploy.sh
```

`PROJECT_DIR` değişkenini kendi yolunuza göre değiştirin.

Script'i çalıştırılabilir yapın ve çalıştırın:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 Monitoring ve Logs

### PM2 Komutları

```bash
# Status kontrolü
pm2 status

# Logs görüntüleme
pm2 logs loegs-portfolio

# Real-time monitoring
pm2 monit

# Restart
pm2 restart loegs-portfolio

# Stop
pm2 stop loegs-portfolio
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔍 Troubleshooting

### Admin Panel'de Kaydetme Çalışmıyor

1. **File Permissions Kontrolü:**
   ```bash
   ls -la lib/data.json
   # Yazılabilir olmalı (664 veya 666)
   ```

2. **PM2 Logs Kontrolü:**
   ```bash
   pm2 logs loegs-portfolio --lines 100
   ```

3. **Environment Variables Kontrolü:**
   ```bash
   pm2 env loegs-portfolio
   ```

4. **Cookie Domain Kontrolü:**
   - Browser DevTools → Application → Cookies
   - `admin-token` cookie'sinin domain'i `.loegs.com` olmalı
   - `Secure` flag aktif olmalı (HTTPS'de)

### Port Kullanımda Hatası

```bash
# Port 3000'in kullanımda olup olmadığını kontrol edin
sudo lsof -i :3000

# Farklı bir port kullanmak için ecosystem.config.js'de PORT değiştirin
```

### Nginx 502 Bad Gateway

1. Next.js uygulamasının çalıştığını kontrol edin:
   ```bash
   pm2 status
   ```

2. Nginx'in doğru port'a proxy yaptığını kontrol edin:
   ```bash
   sudo nano /etc/nginx/sites-available/loegs.com
   # proxy_pass http://localhost:3000; doğru olmalı
   ```

## 🔐 Güvenlik Kontrolleri

1. **Environment Variables:**
   - `.env.local` dosyası `.gitignore`'da olmalı
   - Production'da güvenli bir şekilde saklanmalı

2. **File Permissions:**
   - `lib/data.json` sadece yazılabilir olmalı, herkese açık olmamalı
   - `public/uploads` dizini yazılabilir olmalı

3. **Firewall:**
   - Sadece gerekli portlar açık olmalı (22, 80, 443)
   - SSH için key-based authentication kullanın

4. **SSL:**
   - HTTPS zorunlu olmalı
   - SSL sertifikası düzenli olarak yenilenmeli

## 📝 Güncelleme İşlemi

Yeni bir deployment için:

```bash
cd /var/www/loegs
./deploy.sh
```

Veya manuel olarak:

```bash
cd /var/www/loegs
git pull  # veya dosyaları güncelleyin
npm install
npm run build
pm2 restart loegs-portfolio
```

## ✅ Deployment Checklist

- [ ] Node.js 18+ yüklü
- [ ] PM2 yüklü ve çalışıyor
- [ ] Nginx yüklü ve çalışıyor
- [ ] Domain DNS ayarları yapılmış
- [ ] SSL sertifikası kurulmuş
- [ ] Environment variables ayarlanmış
- [ ] File permissions doğru ayarlanmış
- [ ] PM2 ile uygulama başlatılmış
- [ ] Nginx config doğru yapılandırılmış
- [ ] Firewall ayarları yapılmış
- [ ] Admin panel test edilmiş
- [ ] Kaydetme işlemi test edilmiş

## 🆘 Destek

Sorun yaşarsanız:

1. PM2 logs kontrol edin: `pm2 logs loegs-portfolio`
2. Nginx logs kontrol edin: `sudo tail -f /var/log/nginx/error.log`
3. Browser console'da hataları kontrol edin
4. Network tab'da cookie'leri kontrol edin

