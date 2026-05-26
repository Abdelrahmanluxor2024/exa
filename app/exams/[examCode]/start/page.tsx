"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import ExamTimer from "@/components/ExamTimer";
import ProgressBar from "@/components/ProgressBar";
import QuestionDisplay from "@/components/QuestionDisplay";
import { BookOpen, LogOut, CheckSquare, ChevronRight, ChevronLeft, AlertCircle, RefreshCw } from "lucide-react";

// Fallback questions for mock exams
const MOCK_QUESTIONS: Record<string, any[]> = {
  "hist-ch1": [
    {
      id: "q1",
      question_text: "من هو المؤسس الحقيقي للدولة العباسية الذي قام بتثبيت أركان الدولة وبناء عاصمتها بغداد؟",
      option_a: "أبو العباس السفاح",
      option_b: "أبو جعفر المنصور",
      option_c: "هارون الرشيد",
      option_d: "المأمون"
    },
    {
      id: "q2",
      question_text: "أي من الخلفاء العباسيين شهد عصره حركة ترجمة علمية واسعة وتأسيس دار الحكمة واشتهر بنقاشاته الفكرية؟",
      option_a: "الخليفة المأمون",
      option_b: "الخليفة هارون الرشيد",
      option_c: "الخليفة المعتصم",
      option_d: "الخليفة الواثق بالله"
    },
    {
      id: "q3",
      question_text: "العامل الرئيسي لضعف الدولة العباسية في عصرها الثاني (عصر النفوذ التركي والديلمي) كان:",
      option_a: "قلة الموارد الاقتصادية للخلافة",
      option_b: "زيادة سيطرة القادة العسكريين غير العرب على الحكم والأمراء",
      option_c: "انتقال العاصمة من بغداد إلى الفسطاط",
      option_d: "نقص المساحة الجغرافية للخلافة"
    },
    {
      id: "q4",
      question_text: "ما هي المدينة التي بناها الخليفة العباسي المعتصم بالله ونقل إليها دواوين الخلافة بعد بغداد؟",
      option_a: "سامراء",
      option_b: "القاهرة",
      option_c: "دمشق",
      option_d: "الكوفة"
    },
    {
      id: "q5",
      question_text: "امتد نفوذ الدولة العباسية في أوج قوتها ليصل إلى حدود بلاد ما وراء النهر شرقاً، وجمهورية:",
      option_a: "الأندلس (إسبانيا حالياً)",
      option_b: "بلاد المغرب الإسلامي غرباً",
      option_c: "الصين",
      option_d: "الهند وجنوب آسيا"
    }
  ],
  "hist-ch2": [
    {
      id: "q1",
      question_text: "من هو القائد العسكري المسلم الذي انتصر على المغول في المعركة التاريخية الخالدة 'عين جالوت'؟",
      option_a: "صلاح الدين الأيوبي",
      option_b: "سيف الدين قطز",
      option_c: "الظاهر بيبرس",
      option_d: "نور الدين محمود"
    },
    {
      id: "q2",
      question_text: "تعتبر الدولة الطولونية هي أول دولة مستقلة في مصر، تأسست على يد أحمد بن طولون الذي تعود أصوله إلى:",
      option_a: "الفرس",
      option_b: "الأتراك",
      option_c: "العرب",
      option_d: "الأكراد"
    },
    {
      id: "q3",
      question_text: "ما هي المعركة التي استعاد فيها المسلمون بقيادة صلاح الدين الأيوبي بيت المقدس عام 583 هـ؟",
      option_a: "معركة حطين",
      option_b: "معركة القادسية",
      option_c: "معركة ملاذكرد",
      option_d: "معركة اليرموك"
    },
    {
      id: "q4",
      question_text: "شهد عهد المماليك تشييد صروح معمارية عظيمة في مصر، ومن أشهر مساجدهم مسجد السلطان:",
      option_a: "مسجد عمرو بن العاص",
      option_b: "مسجد أحمد بن طولون",
      option_c: "مسجد السلطان حسن",
      option_d: "الجامع الأزهر"
    },
    {
      id: "q5",
      question_text: "ما هو السبب الأساسي الذي ساعد صلاح الدين الأيوبي على توحيد الجبهة الإسلامية ضد الصليبيين؟",
      option_a: "سقوط الخلافة الفاطمية وتوحيد قيادة مصر والشام تحت راية الخلافة العباسية السنية",
      option_b: "امتلاكه لأسطول بحري جبار يفوق صليبيي البحر",
      option_c: "تحالفه مع إمبراطور بيزنطة",
      option_d: "قلة قلاع الصليبيين في الشام"
    }
  ]
};

// Fallback logic
MOCK_QUESTIONS["hist-final"] = MOCK_QUESTIONS["hist-ch1"];

import { createClient } from "@/utils/supabase/client";

export default function ExamWorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const examCode = params.examCode as string;

  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  
  const [examInfo, setExamInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const secondsTracker = useRef(0);
  const timerIntervalRef = useRef<any>(null);

  // 1. Initialise and load student details
  useEffect(() => {
    const name = sessionStorage.getItem("student_name");
    const phone = sessionStorage.getItem("student_phone");

    if (!name) {
      router.replace(`/exams/${examCode}`);
      return;
    }

    setStudentName(name);
    setStudentPhone(phone || "");

    // 2. Fetch exam structure
    const fetchExamStructure = async () => {
      try {
        const supabase = createClient();
        
        // Fetch exam
        const { data: dbExam } = await supabase
          .from("exams")
          .select("*")
          .eq("exam_code", examCode)
          .single();

        let resolvedExam = dbExam;
        let resolvedQuestions = [];

        if (dbExam) {
          // Fetch questions
          const { data: dbQ } = await supabase
            .from("questions")
            .select("*")
            .eq("exam_id", dbExam.id);
          
          resolvedQuestions = dbQ || [];
        }

        // If not found in DB or empty, load custom mock setup
        if (!resolvedExam) {
          const matchedMock = examCode === "hist-ch2" ? "hist-ch2" : "hist-ch1";
          resolvedExam = {
            id: matchedMock,
            title: examCode === "hist-ch2" ? "اختبار الباب الثاني: مصر ودورها في حماية الهوية الإسلامية" : "اختبار الباب الأول: الدولة العباسية وأمجادها التاريخية",
            exam_code: examCode,
            duration_minutes: examCode === "hist-ch2" ? 45 : 30
          };
          resolvedQuestions = MOCK_QUESTIONS[matchedMock] || MOCK_QUESTIONS["hist-ch1"];
        } else if (resolvedQuestions.length === 0) {
          resolvedQuestions = MOCK_QUESTIONS["hist-ch1"];
        }

        setExamInfo(resolvedExam);
        setQuestions(resolvedQuestions);

        // 3. Load from LocalStorage if present (Autosave retrieval)
        const cacheKey = `exam_progress_${examCode}_${name}`;
        const cachedProgress = localStorage.getItem(cacheKey);

        if (cachedProgress) {
          const parsed = JSON.parse(cachedProgress);
          setAnswers(parsed.answers || {});
          setActiveIdx(parsed.activeIdx || 0);
          
          // Calculate remaining time
          const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
          const totalSecs = resolvedExam.duration_minutes * 60;
          const remaining = Math.max(0, totalSecs - elapsed);
          
          setTimeLeft(remaining);
          secondsTracker.current = parsed.timeSpentSeconds || 0;
        } else {
          setTimeLeft(resolvedExam.duration_minutes * 60);
          
          // Initialize autosave storage
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              answers: {},
              activeIdx: 0,
              startTime: Date.now(),
              timeSpentSeconds: 0
            })
          );
        }
      } catch (err) {
        console.error("Error setting up exam page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamStructure();
  }, [examCode, router]);

  // 4. Autosave to LocalStorage & Keep track of time spent
  useEffect(() => {
    if (!examInfo || loading || submitting) return;

    const cacheKey = `exam_progress_${examCode}_${studentName}`;
    const cached = localStorage.getItem(cacheKey);
    let parsed: any = {};
    if (cached) parsed = JSON.parse(cached);

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        ...parsed,
        answers,
        activeIdx,
        timeSpentSeconds: secondsTracker.current
      })
    );
  }, [answers, activeIdx, examCode, studentName, examInfo, loading, submitting]);

  // Time tracker effect
  useEffect(() => {
    if (loading || submitting || !examInfo) return;

    timerIntervalRef.current = setInterval(() => {
      secondsTracker.current += 1;
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [loading, submitting, examInfo]);

  // 5. Anti-exit warning mechanism
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (submitting) return;
      e.preventDefault();
      e.returnValue = "تنبيه: لم تقم بتسليم الامتحان بعد. هل أنت متأكد من مغادرة الصفحة وفقدان تقدمك؟";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitting]);

  // 6. Handle answer selection
  const handleAnswerSelect = (option: string) => {
    if (submitting) return;
    const activeQ = questions[activeIdx];
    setAnswers((prev) => ({
      ...prev,
      [activeQ.id]: option,
    }));
  };

  // 7. Submit exam handler
  const executeSubmission = async () => {
    if (submitting) return;
    setSubmitting(true);
    setShowConfirmModal(false);
    
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    try {
      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: studentName,
          student_phone: studentPhone,
          exam_id: examInfo.id,
          exam_code: examInfo.exam_code,
          exam_title: examInfo.title,
          answers,
          time_taken_seconds: secondsTracker.current
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Clear autosave cache on success
        const cacheKey = `exam_progress_${examCode}_${studentName}`;
        localStorage.removeItem(cacheKey);
        
        // Save submission result object in sessionStorage
        sessionStorage.setItem("last_result", JSON.stringify(data.result));
        
        // Redirect to result page
        router.push(`/exams/${examCode}/result`);
      } else {
        throw new Error(data.error || "خطأ مجهول أثناء تسليم الإجابات.");
      }
    } catch (err: any) {
      alert(`عذراً، حدث خطأ أثناء إرسال إجاباتك: ${err.message || err}. يرجى التقاط لقطة شاشة لإجاباتك والتواصل مع المعلم.`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-customBg flex flex-col justify-center items-center gap-4">
        <RefreshCw className="h-10 w-10 text-accent animate-spin" />
        <span className="text-lg font-bold text-primary">جاري تحميل واجهة الامتحان وتأمين الاتصال...</span>
      </div>
    );
  }

  const activeQuestion = questions[activeIdx];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-customBg flex flex-col">
      
      {/* DISTRACTION-FREE HEADER */}
      <header className="bg-primary text-white border-b border-primary-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base line-clamp-1">{examInfo.title}</h1>
              <p className="text-xs text-accent-light -mt-0.5 font-bold">بوابة الامتحان الآمنة 🔒</p>
            </div>
          </div>

          {/* Countdown timer component */}
          {timeLeft > 0 && (
            <ExamTimer initialSeconds={timeLeft} onTimeout={executeSubmission} />
          )}
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Question Panel (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top pacing bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <ProgressBar current={answeredCount} total={questions.length} />
            </div>

            {/* Render Question display */}
            {activeQuestion && (
              <QuestionDisplay
                question={activeQuestion}
                questionNumber={activeIdx + 1}
                totalQuestions={questions.length}
                selectedAnswer={answers[activeQuestion.id] || ""}
                onChange={handleAnswerSelect}
              />
            )}

            {/* Pagination controls */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <button
                onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                disabled={activeIdx === 0}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
                <span>السابق</span>
              </button>

              <span className="text-sm font-extrabold text-slate-500">
                السؤال {activeIdx + 1} من {questions.length}
              </span>

              {activeIdx < questions.length - 1 ? (
                <button
                  onClick={() => setActiveIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-5 py-3 rounded-xl font-bold transition-colors"
                >
                  <span>التالي</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-accent/20 transition-all-300"
                >
                  <CheckSquare className="h-5 w-5" />
                  <span>تسليم الامتحان</span>
                </button>
              )}
            </div>

          </div>

          {/* Navigation & Student Meta Sidebar (4 columns) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            
            {/* Identity badge */}
            <div className="border-b border-slate-50 pb-4 space-y-1">
              <span className="text-xs text-slate-400 block">الطالب الحالي:</span>
              <span className="font-bold text-primary block text-md sm:text-lg leading-tight">{studentName}</span>
              <span className="text-xs text-slate-500 block">الهاتف: {studentPhone || "غير متوفر"}</span>
            </div>

            {/* Questions Index Grid */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-primary">لوحة التنقل السريع بين الأسئلة:</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === activeIdx;
                  const isAnswered = !!answers[q.id];
                  
                  let btnStyle = "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200";
                  
                  if (isCurrent) {
                    btnStyle = "bg-primary text-white border-primary ring-2 ring-primary/20 scale-105 shadow-sm";
                  } else if (isAnswered) {
                    btnStyle = "bg-green-50 text-green-700 hover:bg-green-100 border-green-200 border";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveIdx(idx)}
                      className={`h-11 rounded-xl text-sm font-extrabold flex items-center justify-center transition-all duration-300 ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Submit from sidebar */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full inline-flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-base transition-colors shadow-sm"
            >
              <LogOut className="h-5 w-5" />
              <span>إنهاء وتسليم الاختبار</span>
            </button>

          </div>

        </div>
      </main>

      {/* CONFIRMATION SUBMIT MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-6 text-center animate-scale-up">
            
            <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-50 text-accent flex items-center justify-center">
              <AlertCircle className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-xl text-primary">هل أنت متأكد من تسليم الامتحان؟</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                لقد أجبت على <strong className="text-green-600">{answeredCount}</strong> سؤال من أصل <strong className="text-primary">{questions.length}</strong>. 
                {answeredCount < questions.length && (
                  <span className="text-red-500 block font-bold mt-1">تنبيه: هناك أسئلة لم تقم بحلها بعد!</span>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={executeSubmission}
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-accent/15"
              >
                {submitting ? "جاري التسليم..." : "نعم، سلّم الآن"}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
              >
                تراجع وإكمال الحل
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
