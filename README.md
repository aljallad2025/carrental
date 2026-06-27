# 🚗 Car Rental App

تطبيق موبايل احترافي لتأجير وبيع السيارات مبني بـ Ionic + Angular + Capacitor + Supabase

## 🛠️ التقنيات
- **Ionic 7** + **Angular 17** (Standalone Components)
- **Capacitor** → APK للأندرويد
- **Supabase** للبيانات والمصادقة والتخزين
- **Codemagic** للـ CI/CD

## 📁 هيكل المشروع
```
src/
├── app/
│   ├── pages/
│   │   ├── onboarding/         # شاشات الترحيب
│   │   ├── auth/               # تسجيل دخول، تسجيل، نسيان كلمة المرور
│   │   ├── home/               # الصفحة الرئيسية
│   │   ├── cars/               # قائمة إيجار، قائمة بيع، تفاصيل السيارة
│   │   ├── booking/            # حجز إيجار، شراء
│   │   ├── my-bookings/        # حجوزاتي
│   │   ├── payments/           # مدفوعاتي
│   │   ├── chat/               # الدعم الفني
│   │   ├── favorites/          # المفضلة
│   │   ├── profile/            # الملف الشخصي
│   │   └── tabs/               # التنقل السفلي
│   ├── services/
│   │   ├── supabase.service.ts
│   │   ├── auth.service.ts
│   │   ├── cars.service.ts
│   │   ├── booking.service.ts
│   │   └── chat.service.ts
│   ├── models/                 # Car, Booking, Review, ChatMessage, UserProfile
│   └── guards/                 # authGuard
├── assets/
│   └── i18n/                   # ar.json, en.json
└── theme/                      # variables.scss
```

## 🗄️ Supabase - الجداول المطلوبة

```sql
-- جدول المستخدمين
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  id_card_url text,
  license_url text,
  preferred_language text default 'ar',
  dark_mode boolean default true,
  notifications_enabled boolean default true,
  created_at timestamptz default now()
);

-- جدول السيارات
create table cars (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text,
  model text,
  year int,
  category text check (category in ('sedan','suv','luxury','sports','economy')),
  type text check (type in ('rental','sale','both')),
  daily_price numeric,
  sale_price numeric,
  images text[],
  description text,
  seats int,
  transmission text check (transmission in ('automatic','manual')),
  fuel_type text,
  mileage int,
  color text,
  rating numeric default 0,
  reviews_count int default 0,
  is_available boolean default true,
  is_featured boolean default false,
  location text,
  features text[],
  created_at timestamptz default now()
);

-- جدول الحجوزات
create table bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  car_id uuid references cars(id),
  type text check (type in ('rental','purchase')),
  status text check (status in ('pending','active','completed','cancelled')) default 'pending',
  pickup_date date,
  return_date date,
  pickup_location text,
  return_location text,
  extras jsonb,
  total_price numeric,
  payment_method text,
  payment_status text default 'pending',
  notes text,
  created_at timestamptz default now()
);

-- جدول المدفوعات
create table payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  booking_id uuid references bookings(id),
  amount numeric,
  status text default 'pending',
  created_at timestamptz default now()
);

-- جدول المفضلة
create table favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  car_id uuid references cars(id),
  created_at timestamptz default now(),
  unique(user_id, car_id)
);

-- جدول التقييمات
create table reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  car_id uuid references cars(id),
  rating int check (rating between 1 and 5),
  comment text,
  user_name text,
  created_at timestamptz default now()
);

-- جدول المحادثات
create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  message text,
  is_admin boolean default false,
  created_at timestamptz default now()
);
```

## 🚀 كيفية الرفع على GitHub
```bash
git init
git add .
git commit -m "feat: initial car rental app"
git remote add origin https://github.com/YOUR_USERNAME/car-rental-app.git
git push -u origin main
```

## 📱 البناء للأندرويد
```bash
npm install
npm run build
npx cap add android
npx cap sync
npx cap open android
```

## 🔧 Codemagic Setup
1. ارفع المشروع على GitHub
2. اربط الـ repo بـ Codemagic
3. أضف الـ variables:
   - `CM_KEYSTORE` - ملف الـ keystore
   - `CM_KEYSTORE_PASSWORD`
   - `CM_KEY_ALIAS`
   - `CM_KEY_PASSWORD`
   - `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` - للنشر على Play Store
4. ابدأ البناء ✅
