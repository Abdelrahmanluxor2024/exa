# 🎓 منصة الأستاذ أبو الفتيان فهمي - التاريخ الوطني
## 📚 Abou El-Fetyan Fahmy - History Learning Platform

منصة تعليمية إلكترونية متكاملة واحترافية مصممة خصيصاً لمادة التاريخ الوطني للصف الثاني الثانوي للأستاذ القدير **أبو الفتيان فهمي**، مبنية بأحدث التقنيات الحديثة وبدعم كامل للغة العربية والاتجاه من اليمين إلى اليسار (RTL).

---

## 🚀 التقنيات المستخدمة (Tech Stack)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom premium palette (Navy `#1a2754` / Orange `#ff7a30`)
- **Typography:** خط Cairo من Google Fonts
- **Database / Backend:** Supabase (PostgreSQL) + Supabase SSR
- **Data Visualizations:** Recharts (مخططات تحليلية تفاعلية لنتائج الطلاب)
- **Document Exporters:**
  - `jspdf` & `html2canvas` (لتوليد شهادات التقدير والتفوق بصيغة PDF فوراً للمتفوقين)
  - `xlsx` (لتصدير نتائج كشوف طلاب المعلم إلى ملفات Excel ممتازة بنقرة واحدة)

---

## 📁 هيكل المشروع الرئيسي (Folder Structure)
```
app/
├── layout.tsx (RTL + خط Cairo + Metadata)
├── page.tsx (الصفحة الرئيسية الفاخرة)
├── globals.css (إعدادات وخصائص جمالية مخصصة)
├── exams/
│   ├── page.tsx (قائمة الامتحانات النشطة من قاعدة البيانات)
│   └── [examCode]/
│       ├── page.tsx (بوابة التسجيل وإدخال اسم الطالب)
│       ├── start/page.tsx (واجهة الامتحان الآمنة والذكية مع منع الخروج وحفظ التقدم تلقائياً)
│       └── result/page.tsx (النتيجة التفصيلية وتوليد شهادة PDF وتواصل واتساب)
├── admin/
│   ├── page.tsx (تسجيل دخول المعلم برقم سري: admin123)
│   └── dashboard/page.tsx (لوحة تحكم المعلم والإحصاءات والمخططات وتصدير Excel)
└── api/
    └── submit-exam/route.ts (خادم التقييم والحفظ التلقائي)
```

---

## 🔐 إعداد المتغيرات البيئية (Environment Variables)
تم إنشاء ملف `.env.local` في جذر المشروع بالمحتوى التالي تماماً للاتصال بقاعدة بيانات Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hnxbmdgnvtrylkouzkbo.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_x_1EsUy1dN9Ir27oMBC9TA_qrvRnAYD
```

---

## 🗄️ تهيئة قاعدة بيانات Supabase (SQL Database Seeding)
لتشغيل المنصة ديناميكياً 100% مع الجداول، يرجى تشغيل الأوامر البرمجية التالية (SQL Queries) داخل الـ **SQL Editor** الخاص بلوحة تحكم Supabase لإنشاء الجداول اللازمة:

```sql
-- 1. جدول الامتحانات (exams)
create table exams (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  exam_code text unique not null,
  duration_minutes integer not null default 30,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. جدول الأسئلة (questions)
create table questions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references exams(id) on delete cascade not null,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null, -- 'a', 'b', 'c', 'd'
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. جدول نتائج الطلاب (student_results)
create table student_results (
  id uuid default gen_random_uuid() primary key,
  student_name text not null,
  student_phone text,
  exam_id text not null,
  exam_code text not null,
  exam_title text not null,
  total_questions integer not null,
  correct_answers integer not null,
  wrong_answers integer not null,
  score_percentage numeric not null,
  answers jsonb not null,
  time_taken_seconds integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 💡 ميزة التحول التلقائي الذكي (Graceful Mock Fallback)
إذا تم تشغيل المنصة **قبل تهيئة قاعدة البيانات أو في حال كانت الجداول فارغة**، ستتحول المنصة تلقائياً وبشكل مبهر إلى **وضع البيانات التجريبية الراقية (Mock Mode)** لعرض امتحانات تجريبية للباب الأول والثاني وتقييم إجابات الطلاب وعرض المخططات والشهادات بصورة فورية 100% لتجربة المستخدم بشكل كامل!

---

## 👨‍🏫 لوحة المعلم وحساب الدخول (Admin Portal)
- **مسار لوحة تحكم المعلم:** `/admin`
- **الرقم السري الافتراضي للمدخل الآمن:** `admin123`
- **أهم المميزات المتاحة للمعلم:**
  - لوحة تحليلات تفاعلية بأربعة مؤشرات قياس ذكية.
  - فلاتر فئة ممتازة لتصفية الدرجات (بالاسم، الامتحان، والتاريخ بدقة).
  - مخطط Recharts لعرض مستويات الصف ونسب التفوق كأعمدة بيانية ملونة.
  - زر **"تصدير كشف Excel"** لتحميل شيت إكسيل منظم ومنسق من اليمين إلى اليسار (`RTL`) لدرجات الطلاب الحالية فوراً.

---

## 🛠️ كيفية التشغيل محلياً (Local Development)

1. لتشغيل خادم التطوير محلياً:
   ```bash
   npm run dev
   ```
   *وافتح الرابط التالي في المتصفح:* `http://localhost:3000`

2. لبناء نسخة الإنتاج النهائية للموقع:
   ```bash
   npm run build
   ```

3. لتشغيل نسخة الإنتاج التي تم بناؤها محلياً:
   ```bash
   npm start
   ```

---

## 🎯 مميزات وتفاصيل تجربة المستخدم (Premium UI/UX Features)
- **أزرار وخيارات راديو مصممة مخصصة (Premium Radio Buttons):** بطاقات خيارات ممتازة بالبرتقالي مع كرات تفعيل حركية عند الاختيار بدلاً من أشكال الراديو التقليدية.
- **عداد عد تنازلي متوهج (Pulsing Urgent Timer):** يتوهج بالبرتقالي عند بقاء أقل من 5 دقائق، ويتحول إلى الأحمر الوامض في الدقيقة الأخيرة لتنبيه الطالب مع إطلاق تسليم إجباري تلقائي عند نفاد الوقت لمنع الغش.
- **الحفظ الاحتياطي التلقائي (Session Recovery):** يتم حفظ الإجابات والوقت المتبقي في المتصفح باستمرار، فإذا حدث انقطاع في الكهرباء أو إغلاق الصفحة، يستطيع الطالب العودة لإكمال امتحانه بكل أمان وسلاسة.
- **مكافحة الغش ومغادرة الصفحة (Anti-cheat Exit Warnings):** يعرض تنبيهاً ذكياً يمنع مغادرة الصفحة ويسجل خروج الطالب.
- **تحميل شهادات التقدير الفاخرة (Excellence Certificates):** شهادة تقدير مذهبة بإطارات كلاسيكية عريقة إسلامية وتوقيع المعلم، تُبنى خصيصاً للمتفوقين الحاصلين على درجات متفوقة (أكثر من 50%) وتُحمل كملف PDF فائق الدقة.
- **مشاركة واتساب:** دعم الطالب بروابط جاهزة بنص مميز لمشاركة درجاته بطلاقة مع الأستاذ وعائلته.

---

### 🌟 شعار المنصة
> **" معاً نحو تفوقك ورسم ملامح مستقبلك المشرق "**
