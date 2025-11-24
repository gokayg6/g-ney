/**
 * CardBox Component Kullanım Örnekleri
 * 
 * Bu dosya CardBox component'inin nasıl kullanılacağını gösterir.
 * Gerçek projede kullanmak için bu dosyayı silip, CardBox'ı import ederek kullanabilirsiniz.
 */

import CardBox from "./CardBox";

// Örnek 1: Otomatik tema (mevcut tema'ya göre)
export function Example1() {
  return (
    <CardBox>
      <h2>Başlık</h2>
      <p>Açıklama metni burada. Bu metin her zaman net okunabilmeli.</p>
    </CardBox>
  );
}

// Örnek 2: Light mode zorla
export function Example2() {
  return (
    <CardBox variant="light">
      <h2>Light Mod Başlık</h2>
      <p>Light mod açıklama metni. Arka plan beyaz, yazılar koyu.</p>
    </CardBox>
  );
}

// Örnek 3: Dark mode zorla
export function Example3() {
  return (
    <CardBox variant="dark">
      <h2>Dark Mod Başlık</h2>
      <p>Dark mod açıklama metni. Arka plan koyu, yazılar açık.</p>
    </CardBox>
  );
}

// Örnek 4: Farklı padding boyutları
export function Example4() {
  return (
    <div className="space-y-4">
      <CardBox padding="sm">
        <h3>Küçük Padding</h3>
        <p>p-4 kullanır</p>
      </CardBox>
      
      <CardBox padding="md">
        <h3>Orta Padding</h3>
        <p>p-6 kullanır (varsayılan)</p>
      </CardBox>
      
      <CardBox padding="lg">
        <h3>Büyük Padding</h3>
        <p>p-8 kullanır</p>
      </CardBox>
    </div>
  );
}

// Örnek 5: Özel className ile
export function Example5() {
  return (
    <CardBox className="hover:scale-105 transition-transform">
      <h2>Hover Efekti</h2>
      <p>Özel className ile ekstra stiller ekleyebilirsiniz.</p>
    </CardBox>
  );
}

// Örnek 6: İçerikte özel stiller
export function Example6() {
  return (
    <CardBox>
      <h2 className="text-purple-600 dark:text-purple-400">Özel Renkli Başlık</h2>
      <p className="font-bold">Kalın yazı</p>
      <p>Normal yazı</p>
    </CardBox>
  );
}



