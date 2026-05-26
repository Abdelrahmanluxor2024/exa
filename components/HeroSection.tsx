import Link from "next/link";
import { Play, MessageSquare, GraduationCap } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
      {/* Visual background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-accent filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-light filter blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        
        {/* Basmala */}
        <p className="text-xl sm:text-2xl font-serif text-accent tracking-widest animate-pulse font-medium">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        {/* Educator Info */}
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 shadow-sm">
          <GraduationCap className="h-5 w-5 text-accent animate-bounce" />
          <span className="text-sm font-semibold tracking-wide">أهلاً بك في البوابة التعليمية للتاريخ</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          الأستاذ / <span className="text-accent">أبو الفتيان فهمي</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-medium">
          خبير مادة التاريخ الوطني - الصف الثاني الثانوي
        </p>

        {/* Slogan */}
        <p className="text-md sm:text-xl font-bold bg-accent/20 border border-accent/20 inline-block px-6 py-2 rounded-lg text-accent-light">
          " معاً نحو تفوقك ورسم ملامح مستقبلك المشرق " 🎯
        </p>

        {/* Call-to-actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <Link
            href="/exams"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-xl text-lg font-bold transition-all-300 transform hover:-translate-y-0.5 shadow-lg"
          >
            <Play className="h-5 w-5" />
            <span>ابدأ الامتحانات الآن</span>
          </Link>
          
          <a
            href="https://wa.me/201050074058"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white/20 hover:border-white/40 px-8 py-4 rounded-xl text-lg font-bold transition-all-300"
          >
            <MessageSquare className="h-5 w-5 text-green-400" />
            <span>تواصل عبر واتساب</span>
          </a>
        </div>

      </div>
    </div>
  );
}
