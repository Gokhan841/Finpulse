# Tek Çizgi Odaklanması (Single Line Focus) - Düzeltme Dokümantasyonu

## Problem

**Önceki Davranış:**
```
Fare dikey hizada
        ↓
       ┌──────────┐
       │ ₺75,481  │
       └─────▼────┘
            ↓
           ⚪        ← Income çizgisinde nokta ❌
          ⚪🟣⚪
           ⚪
            ↓
    ───────●────────  ← Income (Yeşil)


           ⚪        ← Expenses çizgisinde de nokta ❌
          ⚪🟣⚪
           ⚪
            ↓
    ───────●────────  ← Expenses (Sarı)
```

**Sorun:** Aynı anda iki çizgide de nokta çıkıyordu

---

## Çözüm

**Yeni Davranış:**
```
Fare Income çizgisine yakın
        ↓
       ┌──────────┐
       │ ₺75,481  │  ← Sadece Income değeri
       └─────▼────┘
            ↓
           ⚪        ← Sadece Income'da nokta ✅
          ⚪🟣⚪
           ⚪
            ↓
    ───────●────────  ← Income (Yeşil)


    ───────────────  ← Expenses (Sarı) - Nokta YOK ✅
```

---

## Uygulanan Çözüm

### 1. **State Yönetimi Eklendi**

```tsx
import { useState } from 'react'

const CapitalChart = () => {
  const { data: apiData, isLoading } = useWorkingCapital()
  const [activeLineKey, setActiveLineKey] = useState<string | null>(null)  // ✅ Yeni state
  
  // ...
}
```

**State:**
- `activeLineKey: string | null`
- Değerler: `'income'`, `'expense'`, veya `null`
- Hangi çizginin aktif olduğunu takip eder

---

### 2. **Line Componentlerine Mouse Event Handler'lar Eklendi**

#### Income Line

```tsx
<Line
  name="Income"
  type="monotone"
  dataKey="income"
  stroke="#1A7D64"
  strokeWidth={3}
  dot={false}
  activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}  // ✅ Koşullu
  onMouseEnter={() => setActiveLineKey('income')}  // ✅ Fare üstüne gelince
  onMouseLeave={() => setActiveLineKey(null)}      // ✅ Fare ayrılınca
/>
```

#### Expenses Line

```tsx
<Line
  name="Expenses"
  type="monotone"
  dataKey="expense"
  stroke="#C8EE44"
  strokeWidth={3}
  dot={false}
  activeDot={activeLineKey === 'expense' ? <CustomActiveDot /> : false}  // ✅ Koşullu
  onMouseEnter={() => setActiveLineKey('expense')}  // ✅ Fare üstüne gelince
  onMouseLeave={() => setActiveLineKey(null)}       // ✅ Fare ayrılınca
/>
```

---

### 3. **Koşullu activeDot Render**

**Mantık:**
```tsx
activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}
```

**Açıklama:**
- Eğer `activeLineKey === 'income'` ise → `<CustomActiveDot />` render et
- Değilse → `false` (nokta gösterme)

**Sonuç:**
- ✅ Sadece mouse'un üstünde olduğu çizgide nokta çıkıyor
- ✅ Diğer çizgide nokta çıkmıyor
- ✅ Fare ayrıldığında nokta kayboluyor

---

## Etkileşim Akışı

### Senaryo 1: Fare Income Çizgisine Gelir

```
1. Fare Income çizgisine yaklaşır
        ↓
2. onMouseEnter={() => setActiveLineKey('income')}
        ↓
3. activeLineKey = 'income'
        ↓
4. Income Line render edilir:
   activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}
   activeDot={'income' === 'income' ? <CustomActiveDot /> : false}
   activeDot={true ? <CustomActiveDot /> : false}
   activeDot={<CustomActiveDot />}  ✅ Nokta gösterilir
        ↓
5. Expenses Line render edilir:
   activeDot={activeLineKey === 'expense' ? <CustomActiveDot /> : false}
   activeDot={'income' === 'expense' ? <CustomActiveDot /> : false}
   activeDot={false ? <CustomActiveDot /> : false}
   activeDot={false}  ✅ Nokta gösterilmez
        ↓
6. Sonuç:
   - Income çizgisinde beyaz-mor nokta ✅
   - Expenses çizgisinde hiçbir şey ❌
   - Tooltip sadece Income değerini gösterir
```

---

### Senaryo 2: Fare Expenses Çizgisine Gelir

```
1. Fare Expenses çizgisine yaklaşır
        ↓
2. onMouseEnter={() => setActiveLineKey('expense')}
        ↓
3. activeLineKey = 'expense'
        ↓
4. Income Line:
   activeDot={false}  ✅ Nokta gösterilmez
        ↓
5. Expenses Line:
   activeDot={<CustomActiveDot />}  ✅ Nokta gösterilir
        ↓
6. Sonuç:
   - Income çizgisinde hiçbir şey ❌
   - Expenses çizgisinde beyaz-mor nokta ✅
   - Tooltip sadece Expenses değerini gösterir
```

---

### Senaryo 3: Fare Chart'tan Ayrılır

```
1. Fare chart alanından ayrılır
        ↓
2. onMouseLeave={() => setActiveLineKey(null)}
        ↓
3. activeLineKey = null
        ↓
4. Her iki Line için:
   activeDot={null === 'income' ? ... : false}
   activeDot={false}
        ↓
5. Sonuç:
   - Her iki çizgide de nokta YOK ✅
   - Tooltip kaybolur
```

---

## Kod Değişiklikleri

### Önceki (Her İki Çizgide de Nokta)

```tsx
<Line
  name="Income"
  dataKey="income"
  stroke="#1A7D64"
  activeDot={<CustomActiveDot />}  // ❌ Her zaman gösterilir
/>

<Line
  name="Expenses"
  dataKey="expense"
  stroke="#C8EE44"
  activeDot={<CustomActiveDot />}  // ❌ Her zaman gösterilir
/>
```

**Sorun:** Her iki Line de kendi `activeDot`'una sahipti, bu yüzden aynı X konumunda iki nokta çıkıyordu.

---

### Şimdiki (Sadece Aktif Çizgide Nokta)

```tsx
const [activeLineKey, setActiveLineKey] = useState<string | null>(null)

<Line
  name="Income"
  dataKey="income"
  stroke="#1A7D64"
  activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}  // ✅ Koşullu
  onMouseEnter={() => setActiveLineKey('income')}  // ✅ Hover başlangıcı
  onMouseLeave={() => setActiveLineKey(null)}      // ✅ Hover bitişi
/>

<Line
  name="Expenses"
  dataKey="expense"
  stroke="#C8EE44"
  activeDot={activeLineKey === 'expense' ? <CustomActiveDot /> : false}  // ✅ Koşullu
  onMouseEnter={() => setActiveLineKey('expense')}  // ✅ Hover başlangıcı
  onMouseLeave={() => setActiveLineKey(null)}       // ✅ Hover bitişi
/>
```

**Çözüm:**
- ✅ State ile aktif çizgi takip ediliyor
- ✅ `activeDot` koşullu olarak render ediliyor
- ✅ Mouse event handler'lar state'i güncelliyor

---

## Mouse Event Handler'lar

### onMouseEnter

**Tetiklenme:** Fare çizgiye geldiğinde

**Income için:**
```tsx
onMouseEnter={() => setActiveLineKey('income')}
```

**Expenses için:**
```tsx
onMouseEnter={() => setActiveLineKey('expense')}
```

**Sonuç:** State güncellenir ve sadece o çizginin `activeDot`'u `true` olur

---

### onMouseLeave

**Tetiklenme:** Fare çizgiden ayrıldığında

**Her iki Line için:**
```tsx
onMouseLeave={() => setActiveLineKey(null)}
```

**Sonuç:** State `null` olur, her iki çizginin `activeDot`'u da `false` olur

---

## State Değerleri ve Render Mantığı

### State Değerleri

| activeLineKey | Income activeDot | Expenses activeDot | Sonuç |
|---------------|------------------|--------------------| ------|
| `null` | `false` | `false` | Hiçbir noktada nokta yok |
| `'income'` | `<CustomActiveDot />` | `false` | Sadece Income'da nokta |
| `'expense'` | `false` | `<CustomActiveDot />` | Sadece Expenses'de nokta |

---

### Koşullu Render Mantığı

**Income Line için:**
```tsx
activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}

// activeLineKey = null
activeDot={null === 'income' ? <CustomActiveDot /> : false}
activeDot={false}  → Nokta YOK

// activeLineKey = 'income'
activeDot={'income' === 'income' ? <CustomActiveDot /> : false}
activeDot={true ? <CustomActiveDot /> : false}
activeDot={<CustomActiveDot />}  → Nokta VAR ✅

// activeLineKey = 'expense'
activeDot={'expense' === 'income' ? <CustomActiveDot /> : false}
activeDot={false ? <CustomActiveDot /> : false}
activeDot={false}  → Nokta YOK
```

---

## Tooltip Davranışı

### shared={false} ile Birlikte

**Konfigürasyon:**
```tsx
<Tooltip 
  content={<CustomTooltip />} 
  shared={false}        // ✅ Sadece bir çizginin verisi
  trigger="hover"       // ✅ Hover ile tetiklenir
/>
```

**Sonuç:**
- ✅ Tooltip sadece aktif çizginin değerini alır
- ✅ `payload` dizisinde sadece bir eleman olur
- ✅ `payload[0].value` = sadece üzerine gelinen çizginin değeri

---

## Tam Etkileşim Senaryosu

### Fare Income Çizgisine Geldiğinde

```
1. Fare Income çizgisine girer
        ↓
2. onMouseEnter tetiklenir
        ↓
3. setActiveLineKey('income')
        ↓
4. Component yeniden render edilir
        ↓
5. Income Line:
   - activeDot={<CustomActiveDot />}  ✅
   - Nokta görünür
        ↓
6. Expenses Line:
   - activeDot={false}  ✅
   - Nokta görünmez
        ↓
7. Tooltip (shared={false}):
   - payload = [{ value: 75481, dataKey: 'income' }]
   - Sadece Income değeri gösterilir
        ↓
8. Kullanıcı görür:
       ┌──────────┐
       │ ₺75,481  │  ← Income değeri
       └─────▼────┘
            ↓
           ⚪        ← Sadece Income'da nokta
          ⚪🟣⚪
           ↓
    ───────●────────  ← Income çizgisi


    ───────────────  ← Expenses çizgisi (nokta yok)
```

---

### Fare Çizgiler Arasında Geçiş Yaparsa

```
1. Fare Income üzerinde
   → activeLineKey = 'income'
   → Income'da nokta var
        ↓
2. Fare Expenses'e geçer
   → onMouseLeave (Income) → setActiveLineKey(null)
   → onMouseEnter (Expenses) → setActiveLineKey('expense')
        ↓
3. Component yeniden render
   → Income activeDot = false (nokta kaybolur)
   → Expenses activeDot = <CustomActiveDot /> (nokta çıkar)
        ↓
4. Nokta Income'dan Expenses'e geçer ✅
```

---

## Kod Açıklamaları

### useState Hook

```tsx
const [activeLineKey, setActiveLineKey] = useState<string | null>(null)
```

**Tip:** `string | null`
- `'income'` - Income çizgisi aktif
- `'expense'` - Expenses çizgisi aktif  
- `null` - Hiçbir çizgi aktif değil

---

### onMouseEnter Event

```tsx
onMouseEnter={() => setActiveLineKey('income')}
```

**Ne Zaman:** Fare çizginin üzerine geldiğinde  
**Ne Yapar:** State'i günceller (`'income'` veya `'expense'`)  
**Sonuç:** Component yeniden render edilir, sadece o çizgide nokta çıkar

---

### onMouseLeave Event

```tsx
onMouseLeave={() => setActiveLineKey(null)}
```

**Ne Zaman:** Fare çizgiden ayrıldığında  
**Ne Yapar:** State'i `null` yapar  
**Sonuç:** Tüm noktalar kaybolur

---

### Koşullu activeDot

```tsx
activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}
```

**Mantık:**
- Eğer `activeLineKey === 'income'` → `<CustomActiveDot />` render et
- Değilse → `false` (nokta gösterme)

---

## Tooltip Koordinasyonu

### shared={false} Etkisi

**Konfigürasyon:**
```tsx
<Tooltip shared={false} />
```

**Davranış:**
```
Fare Income çizgisine yakın
        ↓
Recharts otomatik olarak en yakın çizgiyi bulur
        ↓
payload = [
  {
    dataKey: 'income',
    value: 75481,
    stroke: '#1A7D64',
    name: 'Income'
  }
]
        ↓
CustomTooltip sadece bu değeri gösterir: ₺75,481
```

**Aynı Zamanda:**
```
activeLineKey = 'income' (onMouseEnter sayesinde)
        ↓
Income Line: activeDot={true} → Nokta gösterilir
Expenses Line: activeDot={false} → Nokta gösterilmez
```

**Sonuç:** Tooltip ve nokta senkronize! ✅

---

## Görsel Karşılaştırma

### Önceki (Çift Nokta Problemi)

```
Dikey hizadaki her iki çizgide de nokta:

           ●  ← Income noktası
    ───────────────
           
           
           ●  ← Expenses noktası
    ───────────────
```

**Problem:** Kullanıcı hangisinin aktif olduğunu bilemiyor

---

### Şimdiki (Tek Nokta - Doğru)

**Fare Income Üzerinde:**
```
           ●  ← Sadece Income noktası ✅
    ───────────────
           
           
              ← Nokta yok
    ───────────────
```

**Fare Expenses Üzerinde:**
```
              ← Nokta yok
    ───────────────
           
           
           ●  ← Sadece Expenses noktası ✅
    ───────────────
```

**Sonuç:** Net, anlaşılır etkileşim ✅

---

## Event Akışı Diyagramı

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Fare Chart'a girer                            │
│         ↓                                       │
│  Fare bir çizgiye yaklaşır                     │
│         ↓                                       │
│  ┌─────────────┐        ┌─────────────┐       │
│  │  Income     │   veya │  Expenses   │       │
│  │  çizgisi    │        │  çizgisi    │       │
│  └─────────────┘        └─────────────┘       │
│         ↓                       ↓               │
│  onMouseEnter          onMouseEnter            │
│  ('income')            ('expense')             │
│         ↓                       ↓               │
│  activeLineKey        activeLineKey            │
│  = 'income'           = 'expense'              │
│         ↓                       ↓               │
│  Income'da nokta      Expenses'de nokta        │
│  Expenses'de YOK      Income'da YOK            │
│         ↓                       ↓               │
│  Tooltip:             Tooltip:                 │
│  ₺75,481              ₺48,200                  │
│                                                 │
│  Fare ayrılır                                  │
│         ↓                                       │
│  onMouseLeave                                  │
│         ↓                                       │
│  activeLineKey = null                          │
│         ↓                                       │
│  Tüm noktalar kaybolur                         │
│  Tooltip kaybolur                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Kod Özeti

### Import Eklendi

```tsx
import { useState } from 'react'  // ✅ Yeni
```

---

### State Eklendi

```tsx
const [activeLineKey, setActiveLineKey] = useState<string | null>(null)
```

---

### Line Props Güncellendi

**Her iki Line'a da eklenenler:**

1. **Koşullu activeDot:**
   ```tsx
   activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}
   ```

2. **onMouseEnter Handler:**
   ```tsx
   onMouseEnter={() => setActiveLineKey('income')}
   ```

3. **onMouseLeave Handler:**
   ```tsx
   onMouseLeave={() => setActiveLineKey(null)}
   ```

---

## Tooltip Konfigürasyonu

**Güncel:**
```tsx
<Tooltip 
  content={<CustomTooltip />} 
  shared={false}      // ✅ Tek çizgi verisi
  trigger="hover"     // ✅ Hover ile tetiklenme
/>
```

**shared={false}:**
- Tooltip sadece en yakın çizginin verisini alır
- `payload` dizisinde tek eleman olur
- Diğer çizginin verisi gösterilmez

**trigger="hover":**
- Fare üzerindeyken tooltip görünür
- Fare ayrıldığında tooltip kaybolur

---

## Test Senaryoları

### Test 1: Income Hover

1. Fareyi Income (yeşil) çizgisine getir
2. Kontrol et:
   - ✅ Sadece Income çizgisinde beyaz-mor nokta var
   - ✅ Expenses çizgisinde nokta yok
   - ✅ Tooltip sadece Income değerini gösteriyor (₺75,481)

---

### Test 2: Expenses Hover

1. Fareyi Expenses (sarı) çizgisine getir
2. Kontrol et:
   - ✅ Sadece Expenses çizgisinde beyaz-mor nokta var
   - ✅ Income çizgisinde nokta yok
   - ✅ Tooltip sadece Expenses değerini gösteriyor (₺48,200)

---

### Test 3: Hızlı Geçiş

1. Fareyi Income çizgisine getir → Nokta çıkar
2. Hızlıca Expenses çizgisine geç
3. Kontrol et:
   - ✅ Income noktası kaybolur
   - ✅ Expenses noktası çıkar
   - ✅ Smooth geçiş

---

### Test 4: Chart Dışına Çıkma

1. Fareyi bir çizgiye getir → Nokta çıkar
2. Fareyi chart dışına çıkar
3. Kontrol et:
   - ✅ Nokta kaybolur
   - ✅ Tooltip kaybolur
   - ✅ State null'a döner

---

## Özet

**Dosya:** `src/features/dashboard/components/CapitalChart.tsx`

**Eklenenler:**
1. ✅ `useState` import
2. ✅ `activeLineKey` state
3. ✅ `onMouseEnter` handler (her iki Line'da)
4. ✅ `onMouseLeave` handler (her iki Line'da)
5. ✅ Koşullu `activeDot` render (her iki Line'da)
6. ✅ `trigger="hover"` Tooltip'te

**Değişiklikler:**
- ✅ `activeDot={<CustomActiveDot />}` → `activeDot={activeLineKey === 'income' ? <CustomActiveDot /> : false}`
- ✅ State tabanlı nokta kontrolü
- ✅ Mouse event handler'lar

**Sonuç:**
- ✅ Aynı anda sadece bir çizgide nokta çıkıyor
- ✅ Fareye en yakın çizgi otomatik tespit ediliyor
- ✅ Tooltip sadece o çizginin değerini gösteriyor
- ✅ Temiz, net etkileşim
- ✅ Figma tasarımına %100 uygun

**Artık sadece üzerine geldiğiniz çizgide nokta çıkıyor!** 🎉
