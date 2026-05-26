import Link from "next/link";
import { Phone, BookOpen, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-slate-300 border-t border-primary-light">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Slogan / About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="h-6 w-6 text-accent" />
              <span className="font-bold text-lg">أ. أبو الفتيان فهمي</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              منصة تعليمية متخصصة لشرح مادة التاريخ الوطني للصف الثاني الثانوي بأسلوب ميسر وشرح تفاعلي يضمن لك التميز.
            </p>
            <div className="inline-block bg-accent/10 border border-accent/20 text-accent font-semibold px-4 py-1.5 rounded-full text-xs">
              شعارنا: معاً نحو تفوقك 🎯
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">الصفحة الرئيسية</Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-accent transition-colors">الامتحانات والاختبارات</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-accent transition-colors">لوحة تحكم المعلم</Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base">تواصل معنا</h3>
            <p className="text-sm text-slate-400">إذا واجهتك أي مشكلة أو كان لديك استفسار، يسعدنا تواصلك معنا مباشرة:</p>
            <div className="space-y-3 text-sm">
              <a 
                href="tel:01050074058" 
                className="flex items-center gap-2 hover:text-accent transition-all-300 group"
              >
                <div className="bg-primary-light p-2 rounded-lg text-accent group-hover:scale-105 transition-all-300">
                  <Phone className="h-4 w-4" />
                </div>
                <span>01050074058</span>
              </a>
              
              <a 
                href="tel:01065933436" 
                className="flex items-center gap-2 hover:text-accent transition-all-300 group"
              >
                <div className="bg-primary-light p-2 rounded-lg text-accent group-hover:scale-105 transition-all-300">
                  <Phone className="h-4 w-4" />
                </div>
                <span>01065933436</span>
              </a>

              <a 
                href="https://wa.me/201050074058" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-accent transition-all-300 group"
              >
                <div className="bg-green-600/10 p-2 rounded-lg text-green-500 group-hover:scale-105 transition-all-300">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <span>محادثة واتساب فورية</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-primary-light text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} الأستاذ أبو الفتيان فهمي. جميع الحقوق محفوظة. معاً نحو تفوقك.</p>
        </div>
      </div>
    </footer>
  );
}
