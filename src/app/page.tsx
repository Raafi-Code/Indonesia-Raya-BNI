"use client";

import { useState, useEffect, useRef } from "react";
import RealTimeClock from "@/components/RealTimeClock";
import ToggleButton from "@/components/ToggleButton";
import TimeInput from "@/components/TimeInput";

export default function Home() {
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [playTime, setPlayTime] = useState("09:55");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wakeLockRef = useRef<any>(null);

  // Default play time (bisa diatur sesuai kebutuhan)
  const defaultPlayTime = "14:00";

  // Keep screen awake - Request Wake Lock
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
          console.log("Wake Lock activated");
        }
      } catch (err) {
        console.log("Wake Lock error:", err);
      }
    };

    requestWakeLock();

    // Re-request wake lock when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && wakeLockRef.current?.released) {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  // Monitor page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      console.log("Page visibility:", !document.hidden ? "visible" : "hidden");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Check time even when page is not visible
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      const targetTime = isCustomTime ? playTime : defaultPlayTime;

      console.log(`Current: ${currentTime}, Target: ${targetTime}, Has Played: ${hasPlayed}`);

      // Auto play jika waktu sesuai dan belum pernah dimainkan
      if (currentTime === targetTime && !hasPlayed && audioRef.current) {
        console.log("Attempting to play audio...");
        playAudio();
        setHasPlayed(true);
      }

      // Reset flag hasPlayed jika waktu sudah lewat
      if (currentTime !== targetTime && hasPlayed) {
        setHasPlayed(false);
      }
    };

    // Check immediately
    checkTime();

    // Use shorter interval for more accuracy
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [isCustomTime, playTime]);

  const playAudio = async () => {
    if (audioRef.current) {
      try {
        // Load audio if not already loaded
        if (audioRef.current.readyState < 2) {
          await audioRef.current.load();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        
        // Show notification if permission granted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🎵 Musik Diputar", {
            body: "Indonesia Raya sedang diputar",
            icon: "/favicon.ico",
          });
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        
        // Fallback: try to play again after a short delay
        setTimeout(async () => {
          try {
            await audioRef.current?.play();
            setIsPlaying(true);
          } catch (retryError) {
            console.error("Retry failed:", retryError);
          }
        }, 1000);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const handleTimeChange = (newTime: string) => {
    setPlayTime(newTime);
    setHasPlayed(false);
  };

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-cyan-50">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
                  <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4 tracking-tight">
              Auto Play Indonesia Raya
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Putar musik secara otomatis pada waktu yang ditentukan
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            {/* Left Column - Clock & Controls */}
            <div className="space-y-8">
              {/* Real Time Clock Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-100/50 hover:shadow-3xl transition-all duration-300">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping opacity-75"></div>
                  </div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                    Real Time
                  </h2>
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <RealTimeClock />
              </div>

              {/* Mode Toggle Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100/50">
                <h3 className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>Mode Pemutaran</span>
                </h3>
                <ToggleButton onChange={setIsCustomTime} />
              </div>

              {/* Time Input Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100/50">
                <TimeInput
                  value={isCustomTime ? playTime : defaultPlayTime}
                  onChange={handleTimeChange}
                  disabled={!isCustomTime}
                  label="Waktu Pemutaran Musik"
                />
              </div>
            </div>

            {/* Right Column - Music Player */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                  {/* Music Icon - Custom Design */}
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    {/* Outer rotating circle */}
                    <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-spin-slow"></div>
                    {/* Inner circle with vinyl record design */}
                    <div className="absolute inset-4 bg-white/90 rounded-full shadow-2xl flex items-center justify-center">
                      {/* Center dot */}
                      <div className="absolute w-8 h-8 bg-primary rounded-full"></div>
                      {/* Vinyl grooves */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-2 border-primary/20 rounded-full"></div>
                        <div className="absolute w-16 h-16 border-2 border-primary/30 rounded-full"></div>
                        <div className="absolute w-12 h-12 border-2 border-primary/40 rounded-full"></div>
                      </div>
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg 
                          className="w-10 h-10 text-white z-10 drop-shadow-lg" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Pulse effect */}
                    {isPlaying && (
                      <div className="absolute inset-0 border-4 border-white/50 rounded-full animate-ping"></div>
                    )}
                  </div>

                  <h2 className="text-3xl font-bold text-center mb-2">
                    Music Player
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-white/80 mb-8 text-lg">
                    {isPlaying ? (
                      <>
                        <svg className="w-6 h-6 text-green-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                        <span>Sedang Memutar...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                        <span>Siap Diputar</span>
                      </>
                    )}
                  </div>

                  {/* Play/Pause Button */}
                  <div className="flex justify-center mb-8">
                    <button
                      onClick={toggleAudio}
                      className="group relative px-12 py-5 bg-white text-primary font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden"
                    >
                      {/* Animated background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {isPlaying ? (
                        <>
                          {/* Pause Icon SVG */}
                          <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-12">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          </div>
                          <span className="relative z-10 text-xl">Pause Music</span>
                        </>
                      ) : (
                        <>
                          {/* Play Icon SVG */}
                          <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <span className="relative z-10 text-xl">Play Music</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Audio Controls */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <audio
                      ref={audioRef}
                      src="/music.mp3"
                      preload="auto"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full"
                      controls
                    />
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-white/50'}`}></div>
                      <span className="text-sm text-white/80">
                        {isPlaying ? 'Playing' : 'Stopped'}
                      </span>
                    </div>
                    {!isVisible && (
                      <div className="flex items-center gap-2 text-xs text-yellow-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Tab tidak aktif</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100/50">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Panduan Penggunaan</h3>
                    <ul className="text-sm text-gray-600 space-y-1.5">
                      <li>• <strong>Default:</strong> Musik auto-play pada {defaultPlayTime}</li>
                      <li>• <strong>Custom Time:</strong> Atur waktu sendiri</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Unit Logistic - BNI Banjarmasin</p>
          </div>
        </div>
      </section>
    </div>
  );
}
