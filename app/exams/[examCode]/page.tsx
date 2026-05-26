import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentNameForm from "@/components/StudentNameForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { HelpCircle, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

const MOCK_EXAMS = [
  {
    id: "mock-1",
    title: "اختبار الباب الأول: الدولة العباسية وأمجادها التاريخية",
    description: "شامل لأسئلة الفهم والربط والتحليل لمجريات الباب الأول وعلاقات الخلافة مع المشرق والمغرب.",
    exam_code: "hist-ch1",
    duration_minutes: 30,
    questions_count: 5
  },
  {
    id: "mock-2",
    title: "اختبار الباب الثاني: مصر ودورها في حماية الهوية الإسلامية",
    description: "يقيس هذا الاختبار استيعاب الطالب لدور مصر القيادي وتأسيس الدول المستقلة الكبرى والدفاع عن الشرق.",
    exam_code: "hist-ch2",
    duration_minutes: 45,
    questions_count: 5
  },
  {
    id: "mock-3",
    title: "المراجعة الشاملة: تاريخ وطني - الفصل الدراسي الثاني",
    description: "أسئلة مراجعة وتدريبات شاملة مصممة بنسق اختبارات نهاية العام وفقاً للوزارة.",
    exam_code: "hist-final",
    duration_minutes: 60,
    questions_count: 5
  }
];

interface ExamGateProps {
  params: {
    examCode: string;
  };
}

export default async function ExamGatePage({ params }: ExamGateProps) {
  const { examCode } = params;
  let activeExam = null;

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: dbExam } = await supabase
      .from("exams")
      .select("*")
      .eq("exam_code", examCode)
      .single();

    if (dbExam) {
      const { count } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("exam_id", dbExam.id);

      activeExam = {
        ...dbExam,
        questions_count: count ?? 5
      };
    }
  } catch (err) {
    console.error("Error loading exam details from Supabase:", err);
  }

  // Fallback to MOCK_EXAMS if not resolved from DB
  if (!activeExam) {
    activeExam = MOCK_EXAMS.find((e) => e.exam_code === examCode) || MOCK_EXAMS[0];
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-4 max-w-5xl mx-auto sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Instructions Box (8 Columns on desktop) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            
            {/* Title Header */}
            <div className="space-y-2">
              <span className="text-xs text-accent font-bold tracking-widest uppercase block">بوابة الاختبار الإلكتروني</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary leading-tight">
                {activeExam.title}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">{activeExam.description}</p>
            </div>

            {/* Exam Quick Specs */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-primary/5 p-2.5 rounded-xl text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">مدة الامتحان</span>
                  <span className="font-bold text-slate-700 text-sm sm:text-base">{activeExam.duration_minutes} دقيقة</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-accent/5 p-2.5 rounded-xl text-accent">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">عدد الأسئلة</span>
                  <span className="font-bold text-slate-700 text-sm sm:text-base">{activeExam.questions_count} سؤال اختيار متعدد</span>
                </div>
              </div>
            </div>

            {/* Instructions list */}
            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-primary text-base flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span>تعليمات هامة للاختبار:</span>
              </h3>
              
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2 items-start">
                  <span className="h-5 w-5 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">١</span>
                  <span>الرجاء عدم إغلاق هذه الصفحة أو الانتقال لتبويب آخر أثناء تشغيل الامتحان، حفاظاً على تقدمك.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="h-5 w-5 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">٢</span>
                  <span>يبدأ مؤقت العد التنازلي فور الضغط على زر "بدء الامتحان" ولا يتوقف لأي سبب.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="h-5 w-5 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">٣</span>
                  <span>في حال انتهاء وقت الاختبار الكلي، سيقوم النظام تلقائياً بتجميع وحفظ كافة إجاباتك وإرسالها للمعلم.</span>
                </li>
              </ul>
            </div>

            {/* Warning banner */}
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-3 items-start text-orange-800 text-xs sm:text-sm">
              <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
              <span>
                <strong>تنبيه:</strong> سيقوم النظام بمراقبة خروجك من صفحة الاختبار، والنتائج تسجل بدقة عالية لدى خادم المعلم.
              </span>
            </div>

          </div>

          {/* Registration Form Box (5 Columns on desktop) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="font-extrabold text-xl text-primary">سجل بياناتك للبدء</h2>
              <p className="text-slate-500 text-xs">أدخل الاسم بشكل صحيح وبدقة لتوليد شهادة التفوق.</p>
            </div>

            {/* Render Onboarding Form */}
            <StudentNameForm examCode={examCode} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
