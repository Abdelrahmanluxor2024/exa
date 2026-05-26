"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface ExamTimerProps {
  initialSeconds: number;
  onTimeout: () => void;
}

export default function ExamTimer({ initialSeconds, onTimeout }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const onTimeoutRef = useRef(onTimeout);

  // Keep ref updated to avoid stale closures
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeoutRef.current();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Determine warning levels
  const isUrgent = secondsLeft < 60; // Less than 1 minute
  const isWarning = secondsLeft >= 60 && secondsLeft < 300; // Less than 5 minutes

  let timerStyles = "bg-slate-100 text-primary border-slate-200";
  let iconStyles = "text-accent";

  if (isUrgent) {
    timerStyles = "bg-red-50 text-red-700 border-red-200 animate-pulse border-2 shadow-sm";
    iconStyles = "text-red-500 animate-spin";
  } else if (isWarning) {
    timerStyles = "bg-orange-50 text-orange-700 border-orange-200 shadow-sm";
    iconStyles = "text-orange-500 animate-bounce";
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm sm:text-base font-extrabold transition-all duration-300 ${timerStyles}`}>
      {isUrgent ? (
        <AlertTriangle className={`h-4 w-5 sm:h-5 sm:w-5 ${iconStyles}`} />
      ) : (
        <Clock className={`h-4 w-4 sm:h-5 sm:w-5 ${iconStyles}`} />
      )}
      <span className="font-mono tracking-wider">{formatTime(secondsLeft)}</span>
      
      {isUrgent && (
        <span className="text-xs font-bold text-red-500 pr-1 hidden sm:inline">أوشك الوقت على النفاد!</span>
      )}
    </div>
  );
}
