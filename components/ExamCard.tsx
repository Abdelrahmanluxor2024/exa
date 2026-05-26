import Link from "next/link";
import { Clock, BookOpen, ChevronLeft } from "lucide-react";

interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    description: string;
    exam_code: string;
    duration_minutes: number;
    questions_count?: number; // optionally computed
  };
}

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Visual top border line */}
      <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
      
      <div className="p-6 flex-grow space-y-4">
        
        {/* Title */}
        <h3 className="font-extrabold text-xl text-primary group-hover:text-accent transition-colors">
          {exam.title}
        </h3>
        
        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
          {exam.description || "اختبار تقييمي لمادة التاريخ الوطني للصف الثاني الثانوي لقياس الفهم والاستيعاب."}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Clock className="h-4 w-4 text-accent" />
            <span>{exam.duration_minutes} دقيقة</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <BookOpen className="h-4 w-4 text-accent" />
            <span>{exam.questions_count ?? 5} أسئلة</span>
          </div>
        </div>

      </div>

      {/* Button footer */}
      <div className="px-6 pb-6 pt-2">
        <Link
          href={`/exams/${exam.exam_code}`}
          className="w-full inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 rounded-xl transition-all-300"
        >
          <span>ابدأ الامتحان الآن</span>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}
