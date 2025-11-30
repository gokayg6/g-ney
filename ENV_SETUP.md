# Environment Variables Setup

Production için gerekli environment değişkenlerini ayarlayın.

## Gerekli Environment Variables

`.env.local` veya production ortamınızda (Vercel, Netlify, vb.) aşağıdaki değişkenleri ayarlayın:

```env
# Admin Panel Credentials
ADMIN_EMAIL=admin@loegs.com
ADMIN_PASSWORD=your-secure-password-here

# JWT Secret (Production için güçlü bir random string oluşturun)
JWT_SECRET=your-jwt-secret-key-change-in-production

# Environment
NODE_ENV=production

# Domain (Cookie ayarları için)
DOMAIN=loegs.com

# Google Analytics (opsiyonel)
NEXT_PRIVATE_GTID=your-google-analytics-id
```

## Önemli Notlar

1. **JWT_SECRET**: Production için mutlaka güçlü bir random string kullanın. Örnek:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **ADMIN_PASSWORD**: Güçlü bir şifre kullanın.

3. **DOMAIN**: Cookie'lerin doğru domain'e set edilmesi için `loegs.com` olarak ayarlayın.

4. Production'da bu değişkenlerin güvenli bir şekilde saklandığından emin olun (Vercel Environment Variables, Netlify Environment Variables, vb.)

## Cookie Ayarları

Production'da (`loegs.com`) cookie'ler otomatik olarak `.loegs.com` domain'ine set edilir. Bu sayede:
- Ana domain'de (loegs.com) çalışır
- Alt domain'lerde (admin.loegs.com, vb.) de çalışır
- Secure flag production'da otomatik olarak aktif olur

