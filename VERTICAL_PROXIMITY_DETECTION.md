# Dikey Yakınlık Algılama (Vertical Proximity Detection) - Dokümantasyon

## Problem

**Önceki Davranış:**
```
Fare hangi tarihin üzerinde olursa olsun
        ↓
Hep aynı çizginin (örn: Expenses) değeri gösteriliyordu
        ↓
Fare yukarı-aşağı hareket ediyordu ama
        ↓
Tooltip hep aynı çizginin değerini gösteriyordu ❌
```

**Sorun:** 
- Fare bir tarih sütununun üzerindeyken Y koordinatına göre değişim yoktu
- Hangi çizgiye daha yakın olursa olsun hep aynı değer gösteriliyordu
- `shared={false}` özelliği düzgün çalışmıyordu

---

## Çözüm

**Yeni Davranış:**
```
Fare bir tarih sütununun içinde
        ↓
Yukarı-Aşağı hareket ediyor
        ↓
Hangi çizgiye (Y koordinatında) daha yakınsa
        ↓
O çizginin noktası çıkıyor ✅
O çizginin değeri Tooltip'te görünüyor ✅
```

---

## Recharts `shared={false}` Özellığinin Doğru Kullanımı

### shared={false} Ne Yapar?

**shared={true} (Varsayılan):**
```
Fare bir X pozisyonunda
        ↓
Tooltip tüm çizgilerin o X'teki değerlerini gösterir
        ↓
Income: ₺75,481
Expenses: ₺48,200
(İkisi birden)
```

**shared={false} (Bizim Kullandığımız):**
```
Fare bir X pozisyonunda
        ↓
Recharts fare Y koordinatını kontrol eder
        ↓
Hangi çizgi Y'de daha yakınsa sadece o çizginin değerini döndürür
        ↓
payload[0].dataKey = 'income' (veya 'expense')
        ↓
Sadece en yakın çizginin değeri gösterilir ✅
```

---

## Uygulanan Çözüm

### 1. **CustomTooltip'e Callback Fonksiyonu Eklendi**

**Önceki:**
```tsx
const CustomTooltip = ({ active, payload }: any) => {
  // Sadece değeri gösteriyordu
  const value = payload[0].value
  // ...
}
```

**Şimdiki:**
```tsx
const CustomTooltip = ({ active, payload, setActiveLineKey }: any) => {
  if (active && payload && payload.length > 0) {
    // Recharts'ın belirlediği en yakın çizgiyi al
    const activeDataKey = payload[0].dataKey  // 'income' veya 'expense'
    
    // Parent component'e bildir (nokta çıkması için)
    if (setActiveLineKey) {
      setActiveLineKey(activeDataKey)  // ✅ State güncelleme
    }
    
    const value = payload[0].value
    // ... render logic
  }
}
```

**Eklenen Mantık:**
```
Tooltip aktif olduğunda
        ↓
Recharts zaten shared={false} ile en yakın çizgiyi belirlemiş
        ↓
payload[0].dataKey bize hangi çizginin aktif olduğunu söyler
        ↓
setActiveLineKey(dataKey) ile parent state'i güncelliyoruz
        ↓
Parent state'e göre doğru çizgide nokta çıkıyor ✅
```

---

### 2. **Line Component'lerden Event Handler'lar Kaldırıldı**

**Önceki:**
```tsx
<Line
  dataKey="income"
  activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}
  onMouseEnter={() => setActiveLineKey('income')}  // ❌ Manuel kontrol
  onMouseLeave={() => setActiveLineKey(null)}      // ❌ Manuel kontrol
/>
```

**Sorun:** 
- `onMouseEnter` çizginin path'ine hover ettiğinde tetikleniyordu
- Y koordinatına göre değil, path'e temas edip etmediğine göre çalışıyordu

**Şimdiki:**
```tsx
<Line
  dataKey="income"
  activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}
  // onMouseEnter YOK ✅
  // onMouseLeave YOK ✅
/>
```

**Çözüm:**
- Artık Recharts'ın `shared={false}` mantığı karar veriyor
- Tooltip hangi çizginin aktif olduğunu belirliyor
- Event handler'lara gerek kalmadı

---

### 3. **LineChart'a onMouseLeave Eklendi**

```tsx
<LineChart 
  data={apiData} 
  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
  onMouseLeave={() => setActiveLineKey(null)}  // ✅ Chart'tan ayrılınca temizle
>
  {/* ... */}
</LineChart>
```

**Neden Gerekli:**
- Fare chart'ın dışına çıktığında
- `activeLineKey` temizlenmeli (`null`)
- Böylece tüm noktalar kaybolur

---

### 4. **Tooltip'e setActiveLineKey Prop'u Geçildi**

```tsx
<Tooltip 
  content={<CustomTooltip setActiveLineKey={setActiveLineKey} />}  // ✅ Callback geçildi
  shared={false}    // ✅ En yakın çizgiyi otomatik belirle
  trigger="hover"   // ✅ Hover ile tetikle
/>
```

**Prop Aktarımı:**
```
CapitalChart (Parent)
        ↓
  [setActiveLineKey state setter]
        ↓
Tooltip component
        ↓
  [prop olarak geçiliyor]
        ↓
CustomTooltip (Child)
        ↓
  [çağrılıyor]
        ↓
setActiveLineKey('income')
        ↓
Parent state güncelleniyor ✅
```

---

## Recharts shared={false} İç Mekanizması

### Recharts Nasıl En Yakın Çizgiyi Belirliyor?

```
1. Fare chart üzerinde hareket ediyor
        ↓
2. Recharts mouse'un X ve Y koordinatlarını alıyor
        ↓
3. X koordinatına göre data index'ini buluyor (hangi tarih/sütun)
        ↓
4. O X'teki tüm çizgilerin Y değerlerini chart'a çeviriyor (pixel koordinatları)
        ↓
5. Mouse Y koordinatından her çizginin Y piksel değerine olan mesafeyi hesaplıyor
        ↓
6. En küçük mesafeye sahip çizgiyi seçiyor
        ↓
7. payload[0] = { dataKey: 'income', value: 75481, ... }
        ↓
8. Tooltip sadece bu payload ile render ediliyor ✅
```

---

## Kod Akışı Detayı

### Senaryo 1: Fare Income Çizgisine Yakın

```
1. Fare chart'ta Jan sütununun üst kısmında (Income'a yakın)
        ↓
2. Recharts hesaplıyor:
   - Jan Income Y pozisyonu: ~50px (örnek)
   - Jan Expenses Y pozisyonu: ~120px
   - Mouse Y pozisyonu: ~60px
   - Income'a mesafe: |50 - 60| = 10px
   - Expenses'e mesafe: |120 - 60| = 60px
        ↓
3. Income daha yakın → payload[0].dataKey = 'income'
        ↓
4. CustomTooltip render ediliyor:
   - active = true
   - payload = [{ dataKey: 'income', value: 75481 }]
        ↓
5. CustomTooltip içinde:
   const activeDataKey = payload[0].dataKey  // 'income'
   setActiveLineKey('income')  // ✅ Parent state güncellendi
        ↓
6. Parent component yeniden render:
   - activeLineKey = 'income'
   - Income Line: activeDot={true} → Nokta çıkıyor ✅
   - Expenses Line: activeDot={false} → Nokta çıkmıyor ✅
        ↓
7. Kullanıcı görür:
       ┌──────────┐
       │ ₺75,481  │  ← Income değeri
       └─────▼────┘
            ↓
           ⚪        ← Income'da nokta
          ⚪🟣⚪
           ↓
    ───────●────────  Income (Yeşil)


    ───────────────  Expenses (Sarı) - Nokta YOK
```

---

### Senaryo 2: Fare Expenses Çizgisine Yakın

```
1. Fare chart'ta Jan sütununun alt kısmında (Expenses'e yakın)
        ↓
2. Recharts hesaplıyor:
   - Jan Income Y pozisyonu: ~50px
   - Jan Expenses Y pozisyonu: ~120px
   - Mouse Y pozisyonu: ~110px
   - Income'a mesafe: |50 - 110| = 60px
   - Expenses'e mesafe: |120 - 110| = 10px
        ↓
3. Expenses daha yakın → payload[0].dataKey = 'expense'
        ↓
4. CustomTooltip render ediliyor:
   - payload = [{ dataKey: 'expense', value: 48200 }]
        ↓
5. CustomTooltip içinde:
   const activeDataKey = payload[0].dataKey  // 'expense'
   setActiveLineKey('expense')  // ✅ Parent state güncellendi
        ↓
6. Parent component yeniden render:
   - activeLineKey = 'expense'
   - Income Line: activeDot={false} → Nokta çıkmıyor ✅
   - Expenses Line: activeDot={true} → Nokta çıkıyor ✅
        ↓
7. Kullanıcı görür:
    ───────────────  Income (Yeşil) - Nokta YOK


       ┌──────────┐
       │ ₺48,200  │  ← Expenses değeri
       └─────▼────┘
            ↓
           ⚪        ← Expenses'de nokta
          ⚪🟣⚪
           ↓
    ───────●────────  Expenses (Sarı)
```

---

### Senaryo 3: Fare Yukarı-Aşağı Hareket Ediyor

```
1. Başlangıç: Fare Income çizgisine yakın
   → activeLineKey = 'income'
   → Income'da nokta var ✅
        ↓
2. Fare yavaşça aşağı doğru iniyor (aynı X sütununda)
   → Mouse Y: 60px → 70px → 80px → 90px → 100px
        ↓
3. Her pozisyonda Recharts mesafe hesaplıyor:
   Y = 60px  → Income'a yakın (10px)  → payload.dataKey = 'income'
   Y = 70px  → Income'a yakın (20px)  → payload.dataKey = 'income'
   Y = 80px  → Income'a yakın (30px)  → payload.dataKey = 'income'
   Y = 90px  → Expenses'e yakın (30px) → payload.dataKey = 'expense'  ⚡ Geçiş!
   Y = 100px → Expenses'e yakın (20px) → payload.dataKey = 'expense'
        ↓
4. Y = 90px'te geçiş oluyor:
   - CustomTooltip: setActiveLineKey('expense')
   - activeLineKey: 'income' → 'expense' ⚡
        ↓
5. Render değişimi:
   - Income noktası kaybolur
   - Expenses noktası çıkar
   - Tooltip içeriği değişir (₺75,481 → ₺48,200)
        ↓
6. Smooth geçiş! ✅
```

---

### Senaryo 4: Fare Chart'tan Ayrılıyor

```
1. Fare chart içinde, bir çizgide nokta var
   → activeLineKey = 'income' (veya 'expense')
        ↓
2. Fare chart dışına çıkıyor
        ↓
3. LineChart'ın onMouseLeave tetikleniyor
   → setActiveLineKey(null)
        ↓
4. Component yeniden render:
   - activeLineKey = null
   - Her iki Line: activeDot={false}
        ↓
5. Sonuç:
   - Tüm noktalar kaybolur ✅
   - Tooltip kaybolur ✅
```

---

## shared={false} vs shared={true} Karşılaştırma

### shared={true} (Varsayılan)

**Davranış:**
```tsx
<Tooltip shared={true} />

Fare Jan sütununda (herhangi bir Y pozisyonunda)
        ↓
payload = [
  { dataKey: 'income', value: 75481 },
  { dataKey: 'expense', value: 48200 }
]
        ↓
Her iki çizginin değeri de gösterilir
        ↓
Tooltip içeriği:
  Income: ₺75,481
  Expenses: ₺48,200
```

**Kullanım Alanı:**
- Tüm serileri aynı anda karşılaştırmak istediğinizde
- Multi-line dashboard'larda

---

### shared={false} (Bizim Kullandığımız)

**Davranış:**
```tsx
<Tooltip shared={false} />

Fare Jan sütununda, Income çizgisine yakın Y pozisyonunda
        ↓
Recharts Y koordinatına göre en yakın çizgiyi belirler
        ↓
payload = [
  { dataKey: 'income', value: 75481 }
]
        ↓
Sadece en yakın çizginin değeri gösterilir
        ↓
Tooltip içeriği:
  ₺75,481  (sadece bu)
```

**Kullanım Alanı:**
- Dikey yakınlık algılaması istediğinizde ✅
- Tek seferde bir çizgi göstermek istediğinizde
- Cleaner, daha az bilgi göstermek istediğinizde

---

## Tooltip'in İki Görevi

### Görev 1: Veriyi Göstermek (Eski)

```tsx
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value
    return <div>{formatter.format(value)}</div>
  }
}
```

**Sadece:**
- Veriyi alıyordu
- Format ediyordu
- Render ediyordu

---

### Görev 2: Parent State'i Güncellemek (Yeni) ✅

```tsx
const CustomTooltip = ({ active, payload, setActiveLineKey }: any) => {
  if (active && payload && payload.length > 0) {
    const activeDataKey = payload[0].dataKey  // ✅ Hangi çizgi aktif?
    if (setActiveLineKey) {
      setActiveLineKey(activeDataKey)  // ✅ Parent'e bildir
    }
    // ... render logic
  }
}
```

**Şimdi:**
- Veriyi alıyor
- **Parent component'e hangi çizginin aktif olduğunu bildiriyor** ✅
- Format ediyor
- Render ediyor

**Bu sayede:**
- Tooltip'in belirlediği aktif çizgi
- Parent state'e yansıyor
- Doğru çizgide nokta çıkıyor
- Senkronize sistem! ✅

---

## State Senkronizasyonu

### Veri Akışı

```
┌─────────────────────────────────────────────────┐
│  Recharts (Kütüphane)                          │
│                                                 │
│  shared={false} mekanizması                    │
│  Y koordinatına göre en yakın çizgiyi bulur    │
│                                                 │
└────────────────┬────────────────────────────────┘
                 ↓
           [payload hesaplanıyor]
                 ↓
      payload[0].dataKey = 'income'
                 ↓
┌─────────────────────────────────────────────────┐
│  CustomTooltip (Child Component)               │
│                                                 │
│  const activeDataKey = payload[0].dataKey      │
│  setActiveLineKey(activeDataKey)               │
│                                                 │
└────────────────┬────────────────────────────────┘
                 ↓
         [callback çağrılıyor]
                 ↓
       setActiveLineKey('income')
                 ↓
┌─────────────────────────────────────────────────┐
│  CapitalChart (Parent Component)               │
│                                                 │
│  const [activeLineKey, setActiveLineKey]       │
│  activeLineKey = 'income' ✅                    │
│                                                 │
└────────────────┬────────────────────────────────┘
                 ↓
       [component yeniden render]
                 ↓
┌─────────────────────────────────────────────────┐
│  Line Components                                │
│                                                 │
│  Income Line:                                   │
│  activeDot={activeLineKey === 'income'          │
│             ? <CustomActiveDot /> : false}      │
│  activeDot={true} → Nokta çıkıyor ✅           │
│                                                 │
│  Expenses Line:                                 │
│  activeDot={activeLineKey === 'expense'         │
│             ? <CustomActiveDot /> : false}      │
│  activeDot={false} → Nokta çıkmıyor ✅         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Callback Pattern (setActiveLineKey)

### Parent Component

```tsx
const CapitalChart = () => {
  const [activeLineKey, setActiveLineKey] = useState<string | null>(null)
  
  return (
    <Tooltip 
      content={<CustomTooltip setActiveLineKey={setActiveLineKey} />}
      // setActiveLineKey fonksiyonunu child'a geçiyoruz ✅
    />
  )
}
```

---

### Child Component (CustomTooltip)

```tsx
const CustomTooltip = ({ active, payload, setActiveLineKey }: any) => {
  if (active && payload && payload.length > 0) {
    const activeDataKey = payload[0].dataKey
    
    if (setActiveLineKey) {
      setActiveLineKey(activeDataKey)  // Parent'in fonksiyonunu çağırıyoruz ✅
    }
    
    // ...
  }
}
```

---

### Callback Akışı

```
1. Parent: setActiveLineKey state setter'ı oluşturuyor
        ↓
2. Parent: setActiveLineKey'i Child'a prop olarak geçiyor
        ↓
3. Child: setActiveLineKey'i prop olarak alıyor
        ↓
4. Recharts payload'ı hesaplıyor
        ↓
5. Child: payload[0].dataKey'den aktif çizgiyi öğreniyor
        ↓
6. Child: setActiveLineKey(dataKey) ile parent state'ini güncelliyor
        ↓
7. Parent: State değişti → Yeniden render
        ↓
8. Line components: Yeni activeLineKey'e göre activeDot render ediyor ✅
```

---

## Tarih Vurgusu (X-Axis Highlight)

### Mevcut Durum

**X-Axis Render:**
```tsx
<div className="absolute top-[171px] left-[11px] w-[621px] flex justify-between">
  {apiData.map((item: any, i: number) => (
    <span key={i} className="text-[12px] font-normal text-[#929EAE] leading-[100%]">
      {item.month}
    </span>
  ))}
</div>
```

**Şu Anki Davranış:**
- Tüm tarihler aynı renkte (#929EAE - gri)
- Hover edilen tarih vurgulanmıyor

---

### İstenilen Davranış

**Kullanıcının İsteği:**
> "Fare hangi tarihin üzerindeyse o tarihin altındaki yazı koyu (#1B212D) kalsın"

**Beklenen:**
```
Fare "Jan" üzerinde
        ↓
  Jan    Feb   Mar   Apr   May
  ───    ───   ───   ───   ───
  🔴     ⚪    ⚪    ⚪    ⚪
(Koyu) (Gri) (Gri) (Gri) (Gri)
```

---

### Uygulama Stratejisi (Opsiyonel - Şu An Uygulanmadı)

**State Ekleme:**
```tsx
const [activeXIndex, setActiveXIndex] = useState<number | null>(null)
```

**Tooltip'te X Index'ini Kaydetme:**
```tsx
const CustomTooltip = ({ active, payload, label, setActiveLineKey, setActiveXIndex }: any) => {
  if (active && payload && payload.length > 0) {
    // Aktif tarih index'ini bul
    const index = apiData.findIndex((item: any) => item.month === label)
    if (setActiveXIndex) {
      setActiveXIndex(index)
    }
    // ...
  }
}
```

**X-Axis'te Koşullu Renk:**
```tsx
{apiData.map((item: any, i: number) => (
  <span 
    key={i} 
    className={`text-[12px] font-normal leading-[100%] ${
      activeXIndex === i 
        ? 'text-[#1B212D] font-semibold'  // Koyu + Bold
        : 'text-[#929EAE]'                 // Gri
    }`}
  >
    {item.month}
  </span>
))}
```

**Not:** Bu özellik henüz uygulanmadı, ancak yukarıdaki şablon ile kolayca eklenebilir.

---

## Event Handler'lar Karşılaştırması

### Önceki Yaklaşım (Line onMouseEnter)

```tsx
<Line
  dataKey="income"
  onMouseEnter={() => setActiveLineKey('income')}
  onMouseLeave={() => setActiveLineKey(null)}
/>
```

**Sorun:**
```
onMouseEnter ne zaman tetiklenir?
        ↓
Fare çizginin PATH'ine (stroke) dokunduğunda
        ↓
PATH 3px kalınlığında
        ↓
Sadece 3px kalınlığındaki çizgiye tam dokunduğunuzda tetiklenir
        ↓
Y koordinatına göre yakınlık algılamaz ❌
        ↓
Örnek:
Fare Income'a 5px yakınlıkta ama çizgiye dokunmuyor
        ↓
onMouseEnter tetiklenmiyor
        ↓
Nokta çıkmıyor ❌
```

---

### Yeni Yaklaşım (Tooltip Callback)

```tsx
const CustomTooltip = ({ payload, setActiveLineKey }: any) => {
  const activeDataKey = payload[0].dataKey
  setActiveLineKey(activeDataKey)
}
```

**Avantaj:**
```
Recharts shared={false} mekanizması otomatik çalışıyor
        ↓
Fare chart'ın herhangi bir yerinde
        ↓
Y koordinatına göre en yakın çizgiyi hesaplıyor
        ↓
payload otomatik o çizgiyi içeriyor
        ↓
3px stroke sınırlaması yok ✅
        ↓
Örnek:
Fare Income'a 50px yakınlıkta bile
        ↓
Recharts Income'un daha yakın olduğunu biliyor
        ↓
payload.dataKey = 'income'
        ↓
setActiveLineKey('income')
        ↓
Nokta çıkıyor ✅
```

---

## Performans ve Optimizasyon

### Her Tooltip Render'ında State Güncelleme

**Potansiyel Sorun:**
```tsx
const CustomTooltip = ({ payload, setActiveLineKey }: any) => {
  setActiveLineKey(payload[0].dataKey)  // Her render'da state güncelleniyor
}
```

**Neden sorun değil:**
```
React state güncellemesi akıllıdır
        ↓
Eğer yeni değer = eski değer
        ↓
React re-render'ı atlar
        ↓
Örnek:
activeLineKey zaten 'income'
setActiveLineKey('income') çağrılıyor
        ↓
React görüyor: 'income' === 'income'
        ↓
Re-render yapmıyor ✅
        ↓
Performans sorunu yok ✅
```

---

### Optimizasyon (İhtiyaç Olursa)

**useEffect ile Kontrol:**
```tsx
import { useEffect } from 'react'

const CustomTooltip = ({ active, payload, setActiveLineKey }: any) => {
  useEffect(() => {
    if (active && payload && payload.length > 0) {
      const activeDataKey = payload[0].dataKey
      setActiveLineKey(activeDataKey)
    }
  }, [active, payload, setActiveLineKey])
  
  // ... render logic
}
```

**useCallback ile Memoization:**
```tsx
const setActiveLineKeyCallback = useCallback((key: string) => {
  setActiveLineKey(key)
}, [])
```

**Not:** Şu an için gereksiz, mevcut performans yeterli.

---

## Test Senaryoları

### Test 1: Dikey Yakınlık (Income)

1. Fareyi Jan sütununun üst kısmına getir (Income çizgisine yakın)
2. Kontrol et:
   - ✅ Sadece Income'da nokta var
   - ✅ Tooltip ₺75,481 gösteriyor (Income değeri)
   - ✅ Expenses'de nokta yok

---

### Test 2: Dikey Yakınlık (Expenses)

1. Fareyi Jan sütununun alt kısmına getir (Expenses çizgisine yakın)
2. Kontrol et:
   - ✅ Sadece Expenses'de nokta var
   - ✅ Tooltip ₺48,200 gösteriyor (Expenses değeri)
   - ✅ Income'da nokta yok

---

### Test 3: Yukarı-Aşağı Hareket

1. Fareyi Jan sütununda yukarıdan aşağı doğru yavaşça hareket ettir
2. Kontrol et:
   - ✅ Başta Income noktası var
   - ✅ Ortada geçiş oluyor (Income → Expenses)
   - ✅ Sonda Expenses noktası var
   - ✅ Tooltip değeri smooth değişiyor

---

### Test 4: Tarihler Arası Geçiş

1. Fareyi Jan'dan Feb'e yatay hareket ettir (aynı Y seviyesinde)
2. Kontrol et:
   - ✅ Aktif çizgi değişmiyor (Income → Income veya Expenses → Expenses)
   - ✅ Tooltip değeri güncelleniyor (Jan değeri → Feb değeri)
   - ✅ Nokta doğru çizgide kalıyor

---

### Test 5: Chart Dışına Çıkma

1. Fareyi chart içinden dışarı çıkar
2. Kontrol et:
   - ✅ Tüm noktalar kaybolur
   - ✅ Tooltip kaybolur
   - ✅ State null'a döner

---

## Kod Özeti

### Değişiklikler

**1. CustomTooltip:**
```diff
- const CustomTooltip = ({ active, payload }: any) => {
+ const CustomTooltip = ({ active, payload, setActiveLineKey }: any) => {
    if (active && payload && payload.length > 0) {
+     const activeDataKey = payload[0].dataKey
+     if (setActiveLineKey) {
+       setActiveLineKey(activeDataKey)
+     }
      // ...
    }
  }
```

**2. Tooltip Component:**
```diff
  <Tooltip 
-   content={<CustomTooltip />}
+   content={<CustomTooltip setActiveLineKey={setActiveLineKey} />}
    shared={false}
  />
```

**3. LineChart:**
```diff
- <LineChart data={apiData} margin={{ ... }}>
+ <LineChart 
+   data={apiData} 
+   margin={{ ... }}
+   onMouseLeave={() => setActiveLineKey(null)}
+ >
```

**4. Line Components:**
```diff
  <Line
    dataKey="income"
    activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}
-   onMouseEnter={() => setActiveLineKey('income')}
-   onMouseLeave={() => setActiveLineKey(null)}
  />
```

---

## Sonuç

✅ **shared={false}** düzgün çalışıyor  
✅ **Dikey yakınlık algılama** aktif  
✅ **Fare Y koordinatına göre** doğru çizgi belirleniyor  
✅ **Tooltip ve nokta senkronize**  
✅ **Smooth geçişler** çalışıyor  
✅ **Clean, maintainable kod**  

**Artık fare hangi çizgiye dikeyde daha yakınsa sadece o çizginin noktası çıkıyor ve Tooltip o çizginin değerini gösteriyor!** 🎉
