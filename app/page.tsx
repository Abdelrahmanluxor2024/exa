import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { Award, ClipboardList, BookOpen, UserCheck, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "خبرة ممتازة في التدريس",
      description: "سنوات من الشرح والتوجيه لطلاب الثانوية العامة والتوجيه الدقيق نحو صياغة الأسئلة الامتحانية.",
      icon: Award,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "متابعة دورية واختبارات",
      description: "اختبارات إلكترونية تفاعلية مستمرة لتقييم وتحديد نقاط القوة ومعالجة نقاط الضعف لكل طالب فورياً.",
      icon: ClipboardList,
      color: "bg-orange-50 text-accent border-orange-100",
    },
    {
      title: "مراجعات ليلة الامتحان",
      description: "حصص مراجعة شاملة ليلة كل امتحان تغطي كافة مخرجات التعلم وأدق تفاصيل المنهج التاريخي.",
      icon: BookOpen,
      color: "bg-green-50 text-green-600 border-green-100",
    },
    {
      title: "شرح مبسط ومنظم",
      description: "تفكيك الأحداث التاريخية وتحليل خريطة الأحداث بأسلوب سردي مبسط يسهل الفهم والحفظ السريع.",
      icon: UserCheck,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Banner Section */}
        <HeroSection />

        {/* Features Grid Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary">
              لماذا تختار الدراسة مع الأستاذ أبو الفتيان فهمي؟
            </h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
            <p className="text-slate-600">
              نقدم نظاماً تعليمياً متكاملاً يعتمد على الفهم والتحليل وربط الأحداث التاريخية لضمان الدرجة النهائية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all-300 transform hover:-translate-y-1 flex flex-col items-center text-center space-y-4"
                >
                  <div className={`p-4 rounded-xl border ${feat.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg text-primary">{feat.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA (Call to action) Section */}
        <section className="bg-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              هل أنت مستعد لقياس مستواك في التاريخ؟
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              ابدأ الآن بتقديم الامتحانات الإلكترونية المتاحة للباب الأول والثاني واستلم نتيجتك وحل الأسئلة فورياً!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/exams"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-accent/25 transition-all-300"
              >
                <span>الذهاب للامتحانات</span>
                <ArrowLeft className="h-5 w-5" />
              </Link>
              
              <a
                href="https://wa.me/201050074058"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-colors border border-slate-700"
              >
                <MessageSquare className="h-5 w-5 text-green-400" />
                <span>استفسار عبر واتساب</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
