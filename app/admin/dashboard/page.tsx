"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, 
  Trophy, 
  BarChart2, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  LogOut,
  Calendar,
  RefreshCw,
  SlidersHorizontal
} from "lucide-react";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

import * as XLSX from "xlsx";

// High-fidelity fallback results for teacher dashboard demonstrations
const MOCK_RESULTS = [
  {
    id: "mock-res-1",
    student_name: "أحمد محمود عبد الحميد علي",
    student_phone: "01012345678",
    exam_code: "hist-ch1",
    exam_title: "اختبار الباب الأول: الدولة العباسية وأمجادها التاريخية",
    total_questions: 5,
    correct_answers: 5,
    wrong_answers: 0,
    score_percentage: 100,
    time_taken_seconds: 720,
    created_at: "2026-05-25T14:30:00.000Z"
  },
  {
    id: "mock-res-2",
    student_name: "محمد حسن خليل إبراهيم",
    student_phone: "01198765432",
    exam_code: "hist-ch1",
    exam_title: "اختبار الباب الأول: الدولة العباسية وأمجادها التاريخية",
    total_questions: 5,
    correct_answers: 4,
    wrong_answers: 1,
    score_percentage: 80,
    time_taken_seconds: 960,
    created_at: "2026-05-25T15:10:00.000Z"
  },
  {
    id: "mock-res-3",
    student_name: "فاطمة الزهراء عمر عبد العزيز",
    student_phone: "01234567890",
    exam_code: "hist-ch2",
    exam_title: "اختبار الباب الثاني: مصر ودورها في حماية الهوية الإسلامية",
    total_questions: 5,
    correct_answers: 3,
    wrong_answers: 2,
    score_percentage: 60,
    time_taken_seconds: 1200,
    created_at: "2026-05-26T09:40:00.000Z"
  },
  {
    id: "mock-res-4",
    student_name: "عبد الله مصطفى كمال الدين",
    student_phone: "01522334455",
    exam_code: "hist-ch2",
    exam_title: "اختبار الباب الثاني: مصر ودورها في حماية الهوية الإسلامية",
    total_questions: 5,
    correct_answers: 5,
    wrong_answers: 0,
    score_percentage: 100,
    time_taken_seconds: 650,
    created_at: "2026-05-26T10:15:00.000Z"
  },
  {
    id: "mock-res-5",
    student_name: "يوسف طارق السيد عبد الرحمن",
    student_phone: "01099887766",
    exam_code: "hist-ch1",
    exam_title: "اختبار الباب الأول: الدولة العباسية وأمجادها التاريخية",
    total_questions: 5,
    correct_answers: 2,
    wrong_answers: 3,
    score_percentage: 40,
    time_taken_seconds: 1400,
    created_at: "2026-05-26T11:00:00.000Z"
  },
  {
    id: "mock-res-6",
    student_name: "مريم عبد الرشيد عثمان النجار",
    student_phone: "01050074058",
    exam_code: "hist-ch2",
    exam_title: "اختبار الباب الثاني: مصر ودورها في حماية الهوية الإسلامية",
    total_questions: 5,
    correct_answers: 4,
    wrong_answers: 1,
    score_percentage: 80,
    time_taken_seconds: 820,
    created_at: "2026-05-26T12:05:00.000Z"
  }
];

export default function AdminDashboard() {
  const router = useRouter();
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // 1. Authorization check on load
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("admin_logged_in");
    
    if (isLoggedIn !== "true") {
      router.replace("/admin");
      return;
    }
    
    setAuthorized(true);

    // 2. Fetch results from Supabase
    const fetchResults = async () => {
      try {
        const supabase = createClient();
        const { data: dbResults, error } = await supabase
          .from("student_results")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbResults && dbResults.length > 0) {
          setResults(dbResults);
        } else {
          setResults(MOCK_RESULTS);
        }
      } catch (err) {
        console.error("Error loading results from Supabase:", err);
        setResults(MOCK_RESULTS);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [router]);

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin");
  };

  if (!authorized) {
    return null; // Don't flash dashboard if unauthorized
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-customBg flex flex-col justify-center items-center gap-4">
        <RefreshCw className="h-10 w-10 text-accent animate-spin" />
        <span className="text-lg font-bold text-primary">جاري تحميل لوحة تحكم المعلم...</span>
      </div>
    );
  }

  // 3. Filtered Results Logic
  const filteredResults = results.filter((res) => {
    const matchesName = res.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === "all" || res.exam_code === selectedExam;
    
    let matchesDate = true;
    if (selectedDate) {
      const dbDate = new Date(res.created_at).toDateString();
      const filterDate = new Date(selectedDate).toDateString();
      matchesDate = dbDate === filterDate;
    }

    return matchesName && matchesExam && matchesDate;
  });

  // 4. Calculate Aggregate Metrics
  const totalStudents = filteredResults.length;
  const perfectScores = filteredResults.filter((r) => r.score_percentage === 100).length;
  
  const avgPercentage = totalStudents > 0 
    ? Math.round(filteredResults.reduce((sum, r) => sum + r.score_percentage, 0) / totalStudents)
    : 0;

  const avgTimeSeconds = totalStudents > 0
    ? Math.round(filteredResults.reduce((sum, r) => sum + r.time_taken_seconds, 0) / totalStudents)
    : 0;

  const formatAvgTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    if (mins > 0) return `${mins} د و ${remSecs} ث`;
    return `${remSecs} ث`;
  };

  // 5. Recharts BarChart Grade distribution logic
  const gradeDistribution = {
    excellent: filteredResults.filter((r) => r.score_percentage >= 90).length,
    great: filteredResults.filter((r) => r.score_percentage >= 75 && r.score_percentage < 90).length,
    good: filteredResults.filter((r) => r.score_percentage >= 50 && r.score_percentage < 75).length,
    needsWork: filteredResults.filter((r) => r.score_percentage < 50).length,
  };

  const chartData = [
    { name: "ممتاز (90%+)", count: gradeDistribution.excellent, fill: "#10b981" },
    { name: "رائع (75-89%)", count: gradeDistribution.great, fill: "#3b82f6" },
    { name: "جيد (50-74%)", count: gradeDistribution.good, fill: "#f97316" },
    { name: "تحسين (<50%)", count: gradeDistribution.needsWork, fill: "#ef4444" },
  ];

  // 6. Excel Export Handler using XLSX
  const exportToExcel = () => {
    const dataToExport = filteredResults.map((r, index) => ({
      "م": index + 1,
      "اسم الطالب الرباعي": r.student_name,
      "رقم الهاتف المحمول": r.student_phone,
      "رمز الامتحان": r.exam_code,
      "اسم الامتحان": r.exam_title,
      "الأسئلة الكلية": r.total_questions,
      "الإجابات الصحيحة": r.correct_answers,
      "الإجابات الخاطئة": r.wrong_answers,
      "النسبة المئوية %": `${r.score_percentage}%`,
      "الوقت المستغرق (بالثواني)": r.time_taken_seconds,
      "تاريخ وتوقيت التقديم": new Date(r.created_at).toLocaleString("ar-EG")
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    
    // Set direction to RTL in Excel WorkBook
    worksheet["!dir"] = "rtl";

    XLSX.utils.book_append_sheet(workbook, worksheet, "نتائج الطلاب التاريخية");
    XLSX.writeFile(workbook, `كشف_نتائج_طلاب_أبو_الفتيان_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Extract unique exam lists present
  const uniqueExams = Array.from(new Set(results.map((r) => JSON.stringify({ code: r.exam_code, title: r.exam_title }))));
  const examFilters = uniqueExams.map((str) => JSON.parse(str));

  return (
    <div className="min-h-screen bg-customBg flex flex-col">
      <Navbar />

      {/* ADMIN TITLE HEAD BAR */}
      <div className="bg-primary text-white border-b border-primary-light">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">لوحة تحكم الأستاذ أبو الفتيان فهمي</h1>
            <p className="text-xs sm:text-sm text-slate-300">مراجعة وتحليل درجات طلاب الصف الثاني الثانوي في مادة التاريخ الوطني</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex justify-center items-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-100 hover:text-white border border-red-500/20 hover:border-red-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 self-start sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* METRIC BOX PANELS */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Analytics Statistics Summary grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total candidates */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold block">إجمالي المختبرين</span>
              <span className="text-3xl font-black text-primary block">{totalStudents}</span>
            </div>
            <div className="bg-primary/5 p-4 rounded-2xl text-primary">
              <Users className="h-6 w-6 text-accent" />
            </div>
          </div>

          {/* Perfect Scores */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold block">العلامة الكاملة (١٠٠%)</span>
              <span className="text-3xl font-black text-green-600 block">{perfectScores}</span>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl text-green-600">
              <Trophy className="h-6 w-6" />
            </div>
          </div>

          {/* Avg percentage */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold block">متوسط النسبة المئوية</span>
              <span className="text-3xl font-black text-blue-600 block">{avgPercentage}%</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <BarChart2 className="h-6 w-6" />
            </div>
          </div>

          {/* Avg time taken */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold block">متوسط زمن الإجابة</span>
              <span className="text-2xl font-black text-orange-600 block">{formatAvgTime(avgTimeSeconds)}</span>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>

        </div>

        {/* METRICS & CHARTS SPLIT DISPLAY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dynamic Interactive Filters Box (5 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
              <SlidersHorizontal className="h-5 w-5 text-accent" />
              <h3 className="font-extrabold text-base text-primary">محرك تصفية الدرجات</h3>
            </div>

            {/* Name input */}
            <div className="space-y-2 text-sm">
              <label htmlFor="searchName" className="font-bold text-primary flex items-center gap-1.5">
                <Search className="h-4 w-4 text-slate-400" />
                <span>البحث باسم الطالب:</span>
              </label>
              <input
                type="text"
                id="searchName"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="أدخل الاسم للبحث الفوري..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-primary font-medium focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all-300"
              />
            </div>

            {/* Exam drop down */}
            <div className="space-y-2 text-sm">
              <label htmlFor="filterExam" className="font-bold text-primary flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-slate-400" />
                <span>تصفية حسب الامتحان:</span>
              </label>
              <select
                id="filterExam"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-primary font-medium focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all-300"
              >
                <option value="all">كل الامتحانات والاختبارات</option>
                <option value="hist-ch1">الباب الأول: الدولة العباسية</option>
                <option value="hist-ch2">الباب الثاني: مصر والدفاع الإسلامي</option>
                {examFilters.map((ef) => (
                  ef.code !== "hist-ch1" && ef.code !== "hist-ch2" && (
                    <option key={ef.code} value={ef.code}>{ef.title}</option>
                  )
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="space-y-2 text-sm">
              <label htmlFor="filterDate" className="font-bold text-primary flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>تحديد تاريخ محدد:</span>
              </label>
              <input
                type="date"
                id="filterDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-primary font-medium focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all-300"
              />
            </div>

            {/* Reset Filters button */}
            {(searchTerm || selectedExam !== "all" || selectedDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedExam("all");
                  setSelectedDate("");
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors"
              >
                إعادة تعيين كافة الفلاتر
              </button>
            )}

          </div>

          {/* Grades Distribution bar chart (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-4 gap-4">
              <h3 className="font-extrabold text-base text-primary">توزيع مستويات تفوق الصف الحالي</h3>
              
              <button
                onClick={exportToExcel}
                className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>تصدير كشف Excel 📊</span>
              </button>
            </div>

            {/* Recharts chart representation */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => [`${value} طلاب`, "العدد"]} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>

        {/* RESULTS TABLE DETAILED ROWS */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-4 py-6">
          
          <div className="px-6 flex justify-between items-center border-b border-slate-50 pb-4">
            <h3 className="font-extrabold text-lg text-primary">جدول تفصيلي بكافة النتائج ({filteredResults.length} طالب)</h3>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold text-xs sm:text-sm border-y border-slate-100">
                  <th className="py-4 px-6">الاسم الرباعي</th>
                  <th className="py-4 px-6">رقم الهاتف</th>
                  <th className="py-4 px-6">الامتحان</th>
                  <th className="py-4 px-6 text-center">الدرجة</th>
                  <th className="py-4 px-6 text-center">النسبة</th>
                  <th className="py-4 px-6 text-center">الوقت</th>
                  <th className="py-4 px-6">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
                {filteredResults.length > 0 ? (
                  filteredResults.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-primary whitespace-nowrap">{r.student_name}</td>
                      <td className="py-4 px-6 font-mono text-slate-500 whitespace-nowrap">{r.student_phone}</td>
                      <td className="py-4 px-6 font-medium text-slate-600 max-w-[200px] truncate">{r.exam_title}</td>
                      <td className="py-4 px-6 text-center font-bold text-slate-700 whitespace-nowrap">
                        {r.correct_answers} / {r.total_questions}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`font-black px-3 py-1 rounded-full ${
                          r.score_percentage >= 90
                            ? "bg-green-50 text-green-600"
                            : r.score_percentage >= 75
                            ? "bg-blue-50 text-blue-600"
                            : r.score_percentage >= 50
                            ? "bg-orange-50 text-orange-600"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {r.score_percentage}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-mono font-medium text-slate-500 whitespace-nowrap">
                        {formatAvgTime(r.time_taken_seconds)}
                      </td>
                      <td className="py-4 px-6 text-slate-400 whitespace-nowrap text-xs">
                        {new Date(r.created_at).toLocaleDateString("ar-EG")} {new Date(r.created_at).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                      لا يوجد أي درجات تطابق معايير التصفية الحالية!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
