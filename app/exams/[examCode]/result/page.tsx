"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResultSummary from "@/components/ResultSummary";
import { 
  Award, 
  RotateCcw, 
  Home, 
  MessageSquare, 
  Download, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Calendar,
  AlertCircle,
  HelpCircle
} from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const examCode = params.examCode as string;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    // Retrieve result from sessionStorage
    const lastResult = sessionStorage.getItem("last_result");
    if (!lastResult) {
      router.replace(`/exams/${examCode}`);
      return;
    }
    setResult(JSON.parse(lastResult));
    setLoading(false);
  }, [examCode, router]);

  if (loading || !result) {
    return (
      <div className="min-h-screen bg-customBg flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto"></div>
          <p className="font-bold text-primary">جاري تحميل تقرير النتيجة...</p>
        </div>
      </div>
    );
  }

  const {
    student_name,
    student_phone,
    exam_title,
    total_questions,
    correct_answers,
    wrong_answers,
    score_percentage,
    answers,
    time_taken_seconds,
    created_at
  } = result;

  // 1. Determine motivation messages
  const getMotivationalText = (percentage: number) => {
    if (percentage >= 90) {
      return {
        title: "🏆 ممتاز جداً ورائع!",
        desc: "لقد أثبتت فهمك العميق وأبهرت معلمك بحصولك على الدرجة النهائية الشرفية. استمر في التميز!",
        color: "bg-emerald-50 text-emerald-800 border-emerald-100",
        badgeColor: "bg-emerald-500 text-white"
      };
    } else if (percentage >= 75) {
      return {
        title: "🌟 أداء رائع ومميز!",
        desc: "أنت قريب جداً من العلامة الكاملة. لقد قمت بمجهود رائع يستحق التقدير والفخر.",
        color: "bg-blue-50 text-blue-800 border-blue-100",
        badgeColor: "bg-blue-500 text-white"
      };
    } else if (percentage >= 50) {
      return {
        title: "👍 جيد جداً، تقدم ممتاز!",
        desc: "أداء مرضي وناجح. مراجعة بعض النقاط البسيطة ستضمن لك العلامة الكاملة في المرة القادمة.",
        color: "bg-orange-50 text-orange-800 border-orange-100",
        badgeColor: "bg-orange-500 text-white"
      };
    } else {
      return {
        title: "💪 لا تيأس أبداً، حاول مجدداً!",
        desc: "الخطأ هو أولى خطوات التعلم. راجع إجاباتك المشروحة بالأسفل وأعد المحاولة، وستتفوق بالتأكيد!",
        color: "bg-red-50 text-red-800 border-red-100",
        badgeColor: "bg-red-500 text-white"
      };
    }
  };

  const motivation = getMotivationalText(score_percentage);

  // 2. WhatsApp share link generator
  const getWhatsAppShareLink = () => {
    const text = `السلام عليكم أستاذ أبو الفتيان، أنا الطالب/ ${student_name}، لقد أتممت اختبار (${exam_title}) وحصلت على نسبة ${score_percentage}% بفضل الله وشرحك الرائع! 🎯`;
    return `https://wa.me/201050074058?text=${encodeURIComponent(text)}`;
  };

  // 3. Export PDF Certificate
  const downloadCertificatePDF = async () => {
    if (!certificateRef.current) return;
    setPdfGenerating(true);

    try {
      const element = certificateRef.current;
      
      // Force element to be temporarily visible and correctly sized
      element.style.display = "block";
      
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution capture
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      // Hide after capturing
      element.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      
      // Setup PDF landscape orientation
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`شهادة_تفوق_${student_name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("حدث خطأ أثناء تحميل الشهادة، يرجى إعادة المحاولة.");
    } finally {
      setPdfGenerating(false);
    }
  };

  // Retake exam helper
  const handleRetake = () => {
    sessionStorage.removeItem("last_result");
    const cacheKey = `exam_progress_${examCode}_${student_name}`;
    localStorage.removeItem(cacheKey);
    router.replace(`/exams/${examCode}`);
  };

  return (
    <div className="min-h-screen bg-customBg flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4 max-w-5xl mx-auto sm:px-6 lg:px-8 w-full space-y-10">
        
        {/* BREATHTAKING MOTIVATION BANNER */}
        <div className={`p-6 sm:p-8 rounded-3xl border text-right shadow-sm flex flex-col sm:flex-row items-center gap-6 ${motivation.color}`}>
          <div className={`h-16 w-16 rounded-2xl shrink-0 flex items-center justify-center text-3xl shadow-md ${motivation.badgeColor}`}>
            🏆
          </div>
          <div className="space-y-2 text-center sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {motivation.title}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed max-w-3xl">
              {motivation.desc}
            </p>
          </div>
        </div>

        {/* ANALYTICS CHARTS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Metadata Card (5 cols) */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-slate-50 pb-4">
              <span className="text-xs text-accent font-bold uppercase">بيانات التقرير العلمي</span>
              <h2 className="font-extrabold text-xl text-primary leading-tight">{student_name}</h2>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                تاريخ التسليم: {new Date(created_at).toLocaleDateString("ar-EG", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="font-medium">الامتحان:</span>
                <span className="font-bold text-primary">{exam_title}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="font-medium">رقم الهاتف المسجل:</span>
                <span className="font-mono text-primary font-bold">{student_phone}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="font-medium">الدرجة الشرفية:</span>
                <span className="font-extrabold text-accent text-base">
                  {correct_answers} من أصل {total_questions} ({score_percentage}%)
                </span>
              </div>
            </div>

            {/* Premium Buttons */}
            <div className="space-y-3 pt-2">
              
              {/* Only allow certificate download if score is passing (>= 50%) */}
              {score_percentage >= 50 && (
                <button
                  onClick={downloadCertificatePDF}
                  disabled={pdfGenerating}
                  className="w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-extrabold py-3.5 rounded-xl text-sm sm:text-base transition-all-300 shadow-md shadow-amber-500/10"
                >
                  <Download className="h-5 w-5 animate-bounce" />
                  <span>{pdfGenerating ? "جاري تجهيز الشهادة..." : "تحميل شهادة التفوق (PDF)"}</span>
                </button>
              )}

              <a
                href={getWhatsAppShareLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-sm sm:text-base transition-colors shadow-sm"
              >
                <MessageSquare className="h-5 w-5 text-green-200" />
                <span>مشاركة النتيجة مع الأستاذ</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRetake}
                  className="inline-flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>إعادة الامتحان</span>
                </button>
                <button
                  onClick={() => router.replace("/")}
                  className="inline-flex justify-center items-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>الرئيسية</span>
                </button>
              </div>

            </div>

          </div>

          {/* Result charts panel (7 cols) */}
          <div className="md:col-span-7">
            <ResultSummary
              correct={correct_answers}
              wrong={wrong_answers}
              total={total_questions}
              percentage={score_percentage}
              timeTakenSeconds={time_taken_seconds}
            />
          </div>

        </div>

        {/* DETAILED QUESTION REVIEW */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
            <BookOpen className="h-6 w-6 text-accent" />
            <h3 className="font-extrabold text-xl text-primary">المراجعة التفصيلية لإجاباتك</h3>
          </div>

          <div className="space-y-8 divide-y divide-slate-100">
            {Object.keys(answers).map((qId, index) => {
              const item = answers[qId];
              const optLabels: Record<string, string> = {
                a: "أ", b: "ب", c: "ج", d: "د"
              };

              return (
                <div key={qId} className={`pt-6 space-y-4 text-right ${index > 0 ? "border-t border-slate-100" : ""}`}>
                  
                  {/* Question Title */}
                  <h4 className="font-bold text-primary text-base sm:text-lg flex gap-2 items-start">
                    <span className="bg-slate-100 text-slate-600 rounded-lg px-2.5 py-0.5 text-xs sm:text-sm font-extrabold shrink-0 mt-0.5">
                      س {index + 1}
                    </span>
                    <span>{item.question}</span>
                  </h4>

                  {/* Student Answer VS Correct Answer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Student Answer */}
                    <div className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
                      item.is_correct 
                        ? "bg-green-50/50 border-green-100 text-green-800" 
                        : "bg-red-50/50 border-red-100 text-red-800"
                    }`}>
                      <div>
                        <span className="text-xs text-slate-400 block font-bold mb-1">إجابتك:</span>
                        <span className="font-bold">
                          ({optLabels[item.student_answer]}) {item.options[item.student_answer] || item.student_answer}
                        </span>
                      </div>
                      {item.is_correct ? (
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                      )}
                    </div>

                    {/* Correct Answer */}
                    <div className="p-4 bg-emerald-50/40 border border-emerald-100/60 rounded-xl flex items-center justify-between text-sm text-emerald-800">
                      <div>
                        <span className="text-xs text-emerald-400 block font-bold mb-1">الإجابة الصحيحة النموذجية:</span>
                        <span className="font-bold">
                          ({optLabels[item.correct_answer]}) {item.options[item.correct_answer]}
                        </span>
                      </div>
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    </div>

                  </div>

                  {/* Explanation panel */}
                  <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-xl text-xs sm:text-sm text-slate-600 space-y-1">
                    <span className="font-bold text-primary block flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-accent" />
                      شرح وتوجيه المعلم للحل الصحيح:
                    </span>
                    <p className="leading-relaxed font-medium">{item.explanation}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <Footer />

      {/* HIDDEN PREMIUM HIGH-RESOLUTION CERTIFICATE (Targeted by html2canvas for PDF capture) */}
      <div className="absolute left-[-9999px] top-[-9999px] hidden">
        <div 
          ref={certificateRef}
          style={{ width: "297mm", height: "210mm" }}
          className="relative bg-white text-slate-800 p-12 select-none border-0 overflow-hidden flex flex-col justify-between"
        >
          {/* Ornate Gold Islamic Border (CSS simulated vintage frame) */}
          <div className="absolute inset-4 border-[8px] border-amber-600 rounded-3xl p-1 pointer-events-none">
            <div className="absolute inset-1 border-2 border-amber-400 rounded-2xl"></div>
          </div>
          
          {/* Inner Corner visual decorations */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-amber-500"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-amber-500"></div>
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-amber-500"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-amber-500"></div>

          {/* Certificate header */}
          <div className="text-center space-y-3 z-10 pt-8">
            <p className="text-amber-600 font-serif text-2xl tracking-widest leading-none">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <h2 className="text-amber-600 text-5xl font-black tracking-wider leading-none">شهادة تقدير وتفوق شرفية</h2>
            <div className="h-1 w-44 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full mt-2"></div>
          </div>

          {/* Certificate Body */}
          <div className="text-center space-y-6 z-10 px-12">
            <p className="text-xl sm:text-2xl font-semibold text-slate-600">
              يسر الأستاذ الخبير <strong className="text-primary text-3xl font-extrabold">أبو الفتيان فهمي</strong> أن يمنح هذه الشهادة لـ:
            </p>
            
            <h1 className="text-slate-900 text-5xl sm:text-6xl font-black tracking-wide border-b-2 border-dashed border-amber-400 inline-block px-12 pb-2 leading-tight">
              {student_name}
            </h1>

            <p className="text-lg sm:text-xl leading-relaxed text-slate-600 max-w-4xl mx-auto font-medium">
              تقديراً لتفوقه الباهر وحصوله على الدرجة النهائية الشرفية بنسبة 
              <strong className="text-amber-600 text-3xl font-extrabold px-1.5">{score_percentage}%</strong> 
              في اختبار التاريخ الوطني للصف الثاني الثانوي الموسوم بـ:
              <br />
              <strong className="text-primary text-2xl font-extrabold block mt-2">({exam_title})</strong>
            </p>

            <p className="text-base text-slate-500 italic">
              "متمنين له دوام التقدم والارتقاء في مدارج العلم والتفوق، وصناعة تاريخه المجيد."
            </p>
          </div>

          {/* Certificate Footer with signatures */}
          <div className="flex justify-between items-end z-10 px-16 pb-8">
            
            {/* Left side: Date */}
            <div className="text-right space-y-1">
              <span className="text-xs text-slate-400 block font-bold">تاريخ إصدار الشهادة</span>
              <span className="font-bold text-slate-700 text-sm">
                {new Date(created_at).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric' })} م
              </span>
            </div>

            {/* Seal Graphic */}
            <div className="w-24 h-24 rounded-full border-4 border-double border-amber-500 flex items-center justify-center rotate-12 bg-amber-50/50 shadow-inner">
              <div className="text-center text-[10px] font-black text-amber-600 leading-tight">
                أ. أبو الفتيان
                <br />
                فهمي
                <br />
                <span className="text-[7px] text-amber-500">معاً نحو تفوقك</span>
              </div>
            </div>

            {/* Right side: Teacher signature */}
            <div className="text-center space-y-1">
              <span className="text-xs text-slate-400 block font-bold">توقيع المعلم</span>
              <span className="font-serif text-amber-600 text-xl font-extrabold block italic">أ. أبو الفتيان فهمي</span>
              <div className="h-0.5 w-28 bg-slate-300 mx-auto mt-0.5"></div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
