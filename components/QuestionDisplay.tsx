"use client";

import { HelpCircle } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string;
  onChange: (option: string) => void;
}

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onChange,
}: QuestionDisplayProps) {
  const options = [
    { key: "a", text: question.option_a, letter: "أ" },
    { key: "b", text: question.option_b, letter: "ب" },
    { key: "c", text: question.option_c, letter: "ج" },
    { key: "d", text: question.option_d, letter: "د" },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      
      {/* Question Header */}
      <div className="flex items-start gap-3 pb-4 border-b border-slate-50">
        <div className="bg-primary/5 p-2 rounded-xl text-primary shrink-0 mt-1">
          <HelpCircle className="h-6 w-6 text-accent" />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-accent font-extrabold uppercase tracking-wide">
            السؤال رقم {questionNumber} من {totalQuestions}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-primary leading-relaxed text-right">
            {question.question_text}
          </h2>
        </div>
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-4 pt-2">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;
          
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              className={`w-full text-right p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group transform active:scale-[0.99] ${
                isSelected
                  ? "border-accent bg-accent/5 text-primary shadow-sm"
                  : "border-slate-100 bg-slate-50 hover:bg-slate-100/50 text-slate-700 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4">
                
                {/* Custom Option Letter circle badge */}
                <div
                  className={`h-8 w-8 rounded-xl font-extrabold text-sm flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isSelected
                      ? "bg-accent text-white shadow-sm rotate-6"
                      : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                  }`}
                >
                  {opt.letter}
                </div>
                
                {/* Option Text */}
                <span className={`font-semibold text-sm sm:text-base leading-relaxed ${isSelected ? "text-primary" : "text-slate-600"}`}>
                  {opt.text}
                </span>

              </div>

              {/* Selection Circle indicator */}
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isSelected
                    ? "border-accent bg-accent"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-white animate-scale-up"></div>
                )}
              </div>

            </button>
          );
        })}
      </div>

    </div>
  );
}
