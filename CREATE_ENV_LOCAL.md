# .env.local Dosyası Oluşturma

`.env.local` dosyası güvenlik nedeniyle Git'e commit edilmez. Bu dosyayı manuel olarak oluşturmanız gerekiyor.

## Hızlı Kurulum

### Windows'ta:

1. Proje klasöründe yeni bir dosya oluşturun: `.env.local`
2. Aşağıdaki içeriği kopyalayıp yapıştırın:

```env
# ============================================
# Admin Panel Credentials
# ============================================
ADMIN_EMAIL=admin@loegs.com
ADMIN_PASSWORD=CHANGE_THIS_PASSWORD_TO_SECURE_ONE

# ============================================
# JWT Secret (Güçlü random string - Production için)
# ============================================
JWT_SECRET=6f94a535b33cd167f3d36472e14973744c06ae0ab2ce28168fa0f0f3b2429d81

# ============================================
# Environment Settings
# ============================================
NODE_ENV=production

# ============================================
# Domain Settings (Cookie ayarları için)
# ============================================
DOMAIN=loegs.com

# ============================================
# Port Settings
# ============================================
PORT=3000

# ============================================
# Google Analytics (Opsiyonel)
# ============================================
# NEXT_PRIVATE_GTID=your-google-analytics-id
```

### Linux/Mac'te:

```bash
# .env.local.example dosyasını kopyalayın
cp .env.local.example .env.local

# Dosyayı düzenleyin
nano .env.local
```

## Önemli Notlar

1. **ADMIN_PASSWORD**: Mutlaka güçlü bir şifre ile değiştirin!
2. **JWT_SECRET**: Bu değer otomatik oluşturuldu, değiştirmenize gerek yok
3. **NODE_ENV**: Production için `production` olarak ayarlı
4. **DOMAIN**: Cookie ayarları için `loegs.com` olarak ayarlı
5. **NEXT_PRIVATE_GTID**: Google Analytics kullanıyorsanız, bu satırın başındaki `#` işaretini kaldırın ve ID'nizi ekleyin

## VDS'de Kullanım

VDS'de `.env.local` dosyasını oluşturduktan sonra:

```bash
# Dosya izinlerini kontrol edin
chmod 600 .env.local

# PM2'yi yeniden başlatın
pm2 restart loegs-portfolio
```

## Güvenlik

- `.env.local` dosyası asla Git'e commit edilmemeli
- Production'da güçlü şifreler kullanın
- JWT_SECRET'ı asla paylaşmayın

