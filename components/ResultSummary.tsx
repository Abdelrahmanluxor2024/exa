"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CheckCircle2, XCircle, Timer, Award } from "lucide-react";

interface ResultSummaryProps {
  correct: number;
  wrong: number;
  total: number;
  percentage: number;
  timeTakenSeconds: number;
}

export default function ResultSummary({
  correct,
  wrong,
  total,
  percentage,
  timeTakenSeconds,
}: ResultSummaryProps) {
  
  // Setup Recharts data
  const data = [
    { name: "إجابات صحيحة ✅", value: correct, color: "#10b981" }, // Emerald 500
    { name: "إجابات خاطئة ❌", value: wrong, color: "#ef4444" },   // Red 500
  ];

  // Formatter for time taken
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (mins > 0) {
      return `${mins} دقيقة و ${remainingSecs} ثانية`;
    }
    return `${remainingSecs} ثانية`;
  };

  return (
    <div className="space-y-8">
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Score Badge */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-accent/10 p-2.5 rounded-xl text-accent">
            <Award className="h-6 w-6" />
          </div>
          <span className="text-xs text-slate-400 font-bold block">النسبة المئوية</span>
          <span className="text-xl sm:text-2xl font-black text-primary block">{percentage}%</span>
        </div>

        {/* Correct Answers Badge */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-green-50 p-2.5 rounded-xl text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <span className="text-xs text-slate-400 font-bold block">صحيح</span>
          <span className="text-xl sm:text-2xl font-black text-green-600 block">
            {correct} / {total}
          </span>
        </div>

        {/* Wrong Answers Badge */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-red-50 p-2.5 rounded-xl text-red-600">
            <XCircle className="h-6 w-6" />
          </div>
          <span className="text-xs text-slate-400 font-bold block">خاطئ</span>
          <span className="text-xl sm:text-2xl font-black text-red-600 block">
            {wrong} / {total}
          </span>
        </div>

        {/* Time Taken Badge */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
            <Timer className="h-6 w-6" />
          </div>
          <span className="text-xs text-slate-400 font-bold block">الوقت المستغرق</span>
          <span className="text-sm sm:text-base font-bold text-primary block truncate max-w-full">
            {formatTime(timeTakenSeconds)}
          </span>
        </div>

      </div>

      {/* Recharts Chart Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-primary text-base text-center">الرسم التحليلي لتوزيع الإجابات</h3>
        
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} إجابة`, "العدد"]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
