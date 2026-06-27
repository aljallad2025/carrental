# 📦 Compatibility Matrix - Car Rental App

## ✅ Verified Compatible Versions

| Package | Version | Notes |
|---------|---------|-------|
| **Node.js** | `20.17.0` | LTS - required by Angular 17 build tools |
| **npm** | `>=9.0.0` | |
| **Java** | `17` | Required by Capacitor 5 + Android Gradle Plugin 8 |
| **Android Studio** | `Hedgehog+` | AGP 8.x support |
| **Android SDK** | API 34 (target), API 22 (min) | |

## Frontend

| Package | Version |
|---------|---------|
| `@angular/core` | `17.3.12` |
| `@angular/cli` | `17.3.17` |
| `@angular/router` | `17.3.12` |
| `@angular/forms` | `17.3.12` |
| `@angular-devkit/build-angular` | `17.3.17` |
| `@ionic/angular` | `7.8.6` |
| `@ionic/angular-toolkit` | `11.0.1` |
| `ionicons` | `7.4.0` |
| `typescript` | `5.2.2` |
| `zone.js` | `0.14.10` |
| `rxjs` | `7.8.2` |
| `tslib` | `2.8.1` |
| `swiper` | `11.2.10` |

## Capacitor (Native)

| Package | Version |
|---------|---------|
| `@capacitor/core` | `5.7.8` |
| `@capacitor/cli` | `5.7.8` |
| `@capacitor/android` | `5.7.8` |
| `@capacitor/camera` | `5.0.10` |
| `@capacitor/push-notifications` | `5.1.2` |
| `@capacitor/geolocation` | `5.0.8` |
| `@capacitor/local-notifications` | `5.0.8` |

## Backend

| Package | Version |
|---------|---------|
| `@supabase/supabase-js` | `2.108.2` |

## Compatibility Notes

- **Ionic 7.x** → supports Angular 14–17 ✅
- **Capacitor 5.x** → supports Android API 22+ / iOS 13+ ✅
- **Capacitor 5.x + AGP** → requires Android Gradle Plugin `8.0+` ✅
- **TypeScript 5.2** → compatible with Angular 17 strict mode ✅
- **Supabase JS 2.x** → stable with Realtime v2 ✅

## ⚠️ Do NOT upgrade these without testing

| Package | Why |
|---------|-----|
| `typescript` | Angular 17 max is `~5.2.x`, v5.3+ breaks compilation |
| `@capacitor/*` | v6+ requires Android API 23+, iOS 14+ — different AGP |
| `@ionic/angular` | v8 requires Angular 18 |
| `zone.js` | Must stay `0.14.x` with Angular 17 |
