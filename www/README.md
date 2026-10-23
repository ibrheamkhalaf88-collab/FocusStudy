# FocusStudy v2.0.0

> **فوكس** — برنامج الدراسة والتركيز مع مؤقت بومودورو، مهام ذكية، تمرين تنفس، موسيقى تركيز، وإحصائيات تقدم

تطبيق مفتوح المصدر يعمل على:
- 🖥️ **Windows** (Electron) — برنامج سطح مكتب محمول (Portable)
- 📱 **Android** (Capacitor) — تطبيق أصلي (APK)
- 🌐 **PWA** — في المتصفح مع إمكانية التثبيت

---

## ✨ المميزات

| القسم | الوصف |
|--------|-------|
| ⏱️ **المؤقت** | بومودورو (25/5/15)، وقت مخصص، ساعة تناظرية حية |
| 📝 **المهام** | تصنيف (مذاكرة/مراجعة/امتحان/واجب)، أولوية، فلترة، تعديل inline |
| 🧘 **التركيز** | تمرين تنفس موجه (4-2-4)، مؤقت متزامن، اقتباسات ملهمة |
| 🎵 **الموسيقى** | أصوات طبيعة مولدة (مطر، غابة، بحر، نار، رياح، ضوضاء بيضاء)، نبضات بيانورال، قنوات YouTube مقترحة |
| 📊 **التقدم** | مخطط أسبوعي، إنجازات، إحصائيات |
| 🎨 **الثيمات** | 4 ثيمات (كوني، غروب، زمردي، محيط) مع حفظ تلقائي |

---

## 🚀 البدء السريع

### المتطلبات
- **Node.js 20+**
- **npm 10+**
- **Windows** (للبناء Electron) أو **Linux/macOS** (للويب فقط)
- **Android Studio + JDK 17** (للبناء Android)

### التثبيت والتشغيل
```bash
# تثبيت التبعيات
npm install

# تشغيل للتطوير (Electron)
npm start

# فحص قبل النشر
npm run preflight

# بناء للويندوز (Portable EXE)
npm run build
```

### النشر والإصدار
```bash
# إصدار patch (2.0.0 → 2.0.1)
npm run release -- patch

# إصدار minor مع بناء Android
npm run release -- minor --android

# إصدار محدد
npm run release -- 2.1.0 --android
```

---

## 📦 البناء للمنصات

### Windows (Electron)
```bash
npm run build
# المخرجات: dist/FocusStudy.exe (Portable, ~50-60 MB)
```

### Android (Capacitor)
```bash
# مزامنة الكود
npm run cap:sync

# بناء Debug APK
npm run cap:build:android:debug
# المخرجات: android/app/build/outputs/apk/debug/app-debug.apk

# بناء Release APK (يتطلب Keystore)
npm run cap:build:android
# المخرجات: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### مفاتيح التوقيع (Android Release)
أضف هذه الأسرار في GitHub Repository Settings → Secrets:
| السر | الوصف |
|------|-------|
| `KEYSTORE_BASE64` | ملف keystore مشفر بـ base64 |
| `KEYSTORE_PASSWORD` | كلمة مرور keystore |
| `KEY_ALIAS` | اسم الـ alias |
| `KEY_PASSWORD` | كلمة مرور المفتاح |

---

## 🛠️ GitHub Actions Workflows

| Workflow | التفعيل | الوظيفة |
|----------|---------|----------|
| `ci.yml` | Push/PR | فحص الكود، بناء تجريبي |
| `release-electron.yml` | Manual | بناء Windows EXE + إنشاء Release |
| `release-android.yml` | Manual | بناء Android APK + إنشاء Release |

**لتشغيل النشر:**
1. اذهب إلى Actions → اختر Workflow → Run workflow
2. أدخل رقم الإصدار (مثال: `2.0.1`)
3. اضغط Run workflow

---

## 📁 هيكل المشروع

```
├── index.html          # التطبيق الرئيسي (HTML + CSS + JS)
├── main.js             # Electron main process
├── preload.js          # Electron preload (security bridge)
├── capacitor-bridge.js # Capacitor native APIs bridge
├── preflight.mjs       # فحوصات ما قبل النشر
├── scripts/
│   └── release.mjs     # سكريبت الإصدار الآلي
├── www/                # أصول الويب لـ Capacitor
├── android/            # مشروع Android (Capacitor)
├── .github/workflows/  # CI/CD
├── assets/             # الخطوط، الأيقونات، إلخ
└── package.json
```

---

## 🔧 التقنيات المستخدمة

- **Electron 31** — سطح المكتب
- **Capacitor 8** — الجوال
- **Vanilla JS (ES Modules)** — بدون frameworks، سريع وخفيف
- **Web Audio API** — توليد الأصوات فورياً (بدون ملفات خارجية)
- **localStorage** — حفظ البيانات محلياً
- **CSS Custom Properties** — ثيمات ديناميكية
- **Apple Fluid Design** — أنيميشن سلسة (Springs، Velocity handoff)

---

## 🎨 فلسفة التصميم

- **One Motif** — علامة الصح ✓ كعنصر بصري موحد
- **Apple Fluid Interactions** — استجابة فورية، انقطاع سلس، تسليم سرعة
- **Reduced Motion** — احترام `prefers-reduced-motion`
- **RTL First** — عربي أولاً، دعم كامل للاتجاه
- **Zero Dependencies (Runtime)** — لا مكتبات UI، كود نقي

---

## 📄 الترخيص

MIT License — حر للاستخدام والتعديل والتوزيع.

---

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ فرع (`git checkout -b feature/amazing-feature`)
3. التزم بالتغييرات (`git commit -m 'Add amazing feature'`)
4. ادفع للفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

---

## 📞 التواصل

- **GitHub Issues** — للأخطاء والمقترحات
- **Discussions** — للأسئلة والأفكار

---

> صُنع بـ ❤️ للطلاب والمطورين العرب