"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Verify password strictly against 'admin123'
    if (password === "admin123") {
      try {
        // Store in sessionStorage and set a direct cookie via document.cookie for protection
        sessionStorage.setItem("admin_logged_in", "true");
        document.cookie = "admin_auth=true; path=/; max-age=86400"; // 24 hours
        
        router.push("/admin/dashboard");
      } catch (err) {
        setError("حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.");
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        setError("كلمة المرور غير صحيحة! يرجى التحقق وإعادة المحاولة.");
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-customBg">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 p-8 shadow-xl space-y-6 text-right">
          
          {/* Header text */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-2">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <h1 className="font-extrabold text-2xl text-primary">لوحة المعلم الخاصة</h1>
            <p className="text-slate-500 text-xs sm:text-sm">هذه المنطقة مخصصة فقط للأستاذ أبو الفتيان فهمي للاطلاع على نتائج الطلاب وإحصائيات الاختبارات.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Password input */}
            <div className="space-y-2">
              <label htmlFor="pass" className="block text-sm font-bold text-primary">
                كلمة المرور السرية للمعلم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="pass"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-4 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-primary font-mono focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all-300"
                />
                
                {/* Toggle Password Visibility button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error box */}
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start text-red-700 text-xs sm:text-sm">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl text-base sm:text-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
