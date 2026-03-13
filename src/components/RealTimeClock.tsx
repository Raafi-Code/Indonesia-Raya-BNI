"use client";

import { useState, useEffect } from "react";

interface RealTimeClockProps {
  className?: string;
}

export default function RealTimeClock({ className = "" }: RealTimeClockProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Format time (HH:MM:SS)
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      // Format date
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("id-ID", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 tracking-tight font-mono">
        {currentTime || "00:00:00"}
      </div>
      <div className="text-lg md:text-xl text-gray-700 dark:text-gray-200 font-medium">
        {currentDate || "Loading..."}
      </div>
    </div>
  );
}
