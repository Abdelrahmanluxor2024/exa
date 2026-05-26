interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
        <span className="text-primary font-medium">التقدم في حل الأسئلة</span>
        <span className="text-accent font-semibold">{percentage}% ({current} من {total})</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div 
          className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
