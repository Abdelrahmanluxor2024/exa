"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Play, AlertCircle } from "lucide-react";

interface StudentNameFormProps {
  examCode: string;
}

export default function StudentNameForm({ examCode }: StudentNameFormProps) {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate quadruple name (contains at least 3 spaces / 4 words)
    const nameParts = studentName.trim().split(/\s+/);
    if (nameParts.length < 4) {
      setError("من فضلك أدخل اسمك الرباعي كاملاً ليتم تسجيلك بشكل صحيح في كشوف المعلم.");
      return;
    }

    // Optional phone validation (Egyptian mobile number standard)
    if (studentPhone.trim() !== "") {
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (!phoneRegex.test(studentPhone.trim())) {
        setError("من فضلك أدخل رقم هاتف محمول صحيح (مثال: 01050074058).");
        return;
      }
    }

    setIsLoading(true);
    
    try {
      // Store in sessionStorage
      sessionStorage.setItem("student_name", studentName.trim());
      sessionStorage.setItem("student_phone", studentPhone.trim() || "غير متوفر");
      
      // Redirect to start page
      router.push(`/exams/${examCode}/start`);
    } catch (err) {
      setError("حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Name Input */}
      <div className="space-y-2">
        <label htmlFor="studentName" className="block text-sm font-bold text-primary">
          الاسم الرباعي للطالب <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <User className="h-5 w-5" />
          </div>
          <input
            type="text"
            id="studentName"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="مثال: أحمد محمد عبد الرحمن علي"
            className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-primary font-medium focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all-300 placeholder:text-slate-400"
          />
        </div>
        <p className="text-xs text-slate-500">الاسم يظهر في شهادة التكريم والنتيجة.</p>
      </div>

      {/* Phone Input */}
      <div className="space-y-2">
        <label htmlFor="studentPhone" className="block text-sm font-bold text-primary">
          رقم الهاتف المحمول (اختياري)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Phone className="h-5 w-5" />
          </div>
          <input
            type="text"
            id="studentPhone"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
            placeholder="مثال: 01050074058"
            className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-primary font-medium focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all-300 placeholder:text-slate-400"
          />
        </div>
        <p className="text-xs text-slate-500">مفيد لمشاركة النتيجة مع ولي الأمر أو للتواصل المباشر.</p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex justify-center items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-xl text-lg transition-all-300 shadow-md shadow-accent/20 disabled:opacity-50 transform hover:-translate-y-0.5"
      >
        {isLoading ? (
          <span>جاري التحميل...</span>
        ) : (
          <>
            <Play className="h-5 w-5" />
            <span>بدء الامتحان الآن</span>
          </>
        )}
      </button>

    </form>
  );
}
