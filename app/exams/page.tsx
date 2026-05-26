import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExamCard from "@/components/ExamCard";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { BookMarked, HelpCircle } from "lucide-react";

// Mock Fallback Exams in case Supabase is empty or has a schema issue initially
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

export const revalidate = 0; // force dynamic rendering

export default async function ExamsPage() {
  let examsList = [];
  
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Fetch exams
    const { data: dbExams, error: examsError } = await supabase
      .from("exams")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (dbExams && dbExams.length > 0) {
      // For each exam, fetch question count
      const resolvedExams = await Promise.all(
        dbExams.map(async (exam) => {
          const { count, error: qError } = await supabase
            .from("questions")
            .select("*", { count: "exact", head: true })
            .eq("exam_id", exam.id);
            
          return {
            ...exam,
            questions_count: qError ? 5 : (count ?? 5)
          };
        })
      );
      examsList = resolvedExams;
    } else {
      examsList = MOCK_EXAMS;
    }
  } catch (err) {
    console.error("Error fetching exams from Supabase:", err);
    examsList = MOCK_EXAMS;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex p-3 bg-accent/10 rounded-2xl border border-accent/20 text-accent mb-2">
            <BookMarked className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
            الامتحانات الإلكترونية المتاحة
          </h1>
          <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            اختر الامتحان المطلوب للبدء الفوري. يرجى قراءة التعليمات والالتزام بالوقت المحدد لكل اختبار.
          </p>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examsList.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>

        {/* Informative Tip Box */}
        <div className="mt-16 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-start max-w-3xl mx-auto">
          <div className="bg-primary/5 p-2 rounded-lg text-primary shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <h4 className="font-bold text-primary">تعليمات هامة قبل بدء الامتحان:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>تأكد من استقرار اتصال الإنترنت قبل بدء الاختبار.</li>
              <li>يرجى إدخال اسمك الرباعي كاملاً ليظهر في كشف المعلم وتصدر به شهادتك.</li>
              <li>عند انتهاء وقت المؤقت، سيتم تسليم إجاباتك تلقائياً لحفظ درجاتك.</li>
            </ul>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
