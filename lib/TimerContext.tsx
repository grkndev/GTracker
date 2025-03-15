import React, { createContext, useContext, useRef, useState, ReactNode, useCallback, useEffect } from 'react';
import Timer from './Timer';
import { formatSecondsToTime } from '../utils/timeUtils';

// Define the shape of the context
interface TimerContextType {
  timer: Timer;
  time: string | null;
  isPaused: boolean;
  subjectTime: string; // Subject timer - active when main timer is active
  breakTime: string;   // Break timer - active when main timer is paused
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  finishTimer: () => void;
}

// Create the context with default values
const TimerContext = createContext<TimerContextType | null>(null);

// Create a provider component
interface TimerProviderProps {
  children: ReactNode;
}

// Helper function to safely check if timer is running
const isTimerRunning = (timer: Timer): boolean => {
  try {
    // Try to use the getIsRunning method if available
    if (typeof timer.getIsRunning === 'function') {
      return timer.getIsRunning();
    }
    // Try to use the checkIsRunning method if available
    if (typeof timer.checkIsRunning === 'function') {
      return timer.checkIsRunning();
    }
    // As a fallback, check the current time - if it's not "00:00:00" and we're not starting fresh
    return timer.getCurrentTime() !== "00:00:00";
  } catch (e) {
    console.warn("Error checking timer status:", e);
    return false;
  }
};

export const TimerProvider = ({ children }: TimerProviderProps) => {
  const [time, setTime] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [subjectTime, setSubjectTime] = useState<string>("00:00:00");
  const [breakTime, setBreakTime] = useState<string>("00:00:00");
  
  // Ref to hold timer tracking data for more precise timing
  const timerDataRef = useRef({
    startTime: 0,
    pauseStartTime: 0,
    totalPauseTime: 0,
    totalSubjectTime: 0,
    totalBreakTime: 0,
    isRunning: false
  });
  
  const timerRef = useRef<Timer>(new Timer());
  
  // Function to calculate and update all timer displays simultaneously
  const updateAllTimers = useCallback(() => {
    if (!timerDataRef.current.isRunning) return;
    
    const now = Date.now();
    const timerData = timerDataRef.current;
    
    if (isPaused) {
      // Update break time
      const currentBreakDuration = now - timerData.pauseStartTime;
      const totalBreakSeconds = Math.floor((timerData.totalBreakTime + currentBreakDuration) / 1000);
      const formattedBreakTime = formatSecondsToTime(totalBreakSeconds);
      setBreakTime(formattedBreakTime);
    } else {
      // Calculate total elapsed time excluding pauses
      const elapsedSinceStart = now - timerData.startTime - timerData.totalPauseTime;
      const totalSubjectSeconds = Math.floor(elapsedSinceStart / 1000);
      const formattedSubjectTime = formatSecondsToTime(totalSubjectSeconds);
      setSubjectTime(formattedSubjectTime);
    }
  }, [isPaused]);
  
  // Set up interval to update all timers
  useEffect(() => {
    if (time === null) return;
    
    const intervalId = setInterval(() => {
      updateAllTimers();
    }, 100); // Update more frequently for better synchronization
    
    return () => clearInterval(intervalId);
  }, [time, isPaused, updateAllTimers]);
  
  // Start the timer
  const startTimer = useCallback(() => {
    const now = Date.now();
    
    if (isPaused) {
      // Coming back from a pause
      const pauseDuration = now - timerDataRef.current.pauseStartTime;
      timerDataRef.current.totalPauseTime += pauseDuration;
      timerDataRef.current.totalBreakTime += pauseDuration;
    } else {
      // First start
      timerDataRef.current.startTime = now;
      timerDataRef.current.totalPauseTime = 0;
      timerDataRef.current.totalSubjectTime = 0;
      timerDataRef.current.totalBreakTime = 0;
    }
    
    timerDataRef.current.isRunning = true;
    
    // Start main timer
    timerRef.current.start((updatedTime) => {
      setTime(updatedTime);
    });
    
    setIsPaused(false);
    updateAllTimers();
  }, [isPaused, updateAllTimers]);

  // Stop (pause) the timer
  const stopTimer = useCallback(() => {
    if (!isPaused) {
      timerDataRef.current.pauseStartTime = Date.now();
    }
    
    // Stop main timer
    timerRef.current.stop();
    setIsPaused(true);
    updateAllTimers();
  }, [isPaused, updateAllTimers]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    const now = Date.now();
    
    // Reset timing data
    timerDataRef.current = {
      startTime: now,
      pauseStartTime: 0,
      totalPauseTime: 0,
      totalSubjectTime: 0,
      totalBreakTime: 0,
      isRunning: true
    };
    
    // Reset main timer
    timerRef.current.reset();
    timerRef.current.start((updatedTime) => {
      setTime(updatedTime);
    });
    
    // Reset timer displays
    setSubjectTime("00:00:00");
    setBreakTime("00:00:00");
    setIsPaused(false);
    updateAllTimers();
  }, [updateAllTimers]);

  // Finish and log the timer
  const finishTimer = useCallback(() => {
    const now = Date.now();
    const timerData = timerDataRef.current;
    let finalSubjectSeconds = 0;
    let finalBreakSeconds = 0;
    
    // Calculate final times
    if (isPaused) {
      // If we're paused, add the current break time
      const currentBreakDuration = now - timerData.pauseStartTime;
      finalBreakSeconds = Math.floor((timerData.totalBreakTime + currentBreakDuration) / 1000);
      finalSubjectSeconds = Math.floor(timerData.totalSubjectTime / 1000);
    } else {
      // If we're running, add the current subject time
      const elapsedSinceStart = now - timerData.startTime - timerData.totalPauseTime;
      finalSubjectSeconds = Math.floor(elapsedSinceStart / 1000);
      finalBreakSeconds = Math.floor(timerData.totalBreakTime / 1000);
    }
    
    // Get formatted times
    const formattedSubjectTime = formatSecondsToTime(finalSubjectSeconds);
    const formattedBreakTime = formatSecondsToTime(finalBreakSeconds);
    
    // Gather timer data from main timer
    const totalTimeWithPauses = timerRef.current.getTotalElapsedTimeWithPauses();
    const activeTime = timerRef.current.getTotalActiveTime();
    const totalSecondsWithPauses = timerRef.current.getTotalElapsedTimeWithPausesInSeconds();
    const activeTimeSeconds = timerRef.current.getTotalActiveTimeInSeconds();

    // Log data (this would typically be saved to a database)
    // console.log('Toplam geçen süre (durdurma süreleri dahil):', totalTimeWithPauses);
    // console.log('Aktif çalışma süresi (durdurma süreleri hariç):', activeTime);
    // console.log('Konu çalışma süresi:', formattedSubjectTime);
    // console.log('Mola süresi:', formattedBreakTime);
    // console.log('Toplam saniye (durdurma dahil):', totalSecondsWithPauses);
    // console.log('Aktif çalışma süresi (saniye):', activeTimeSeconds);
    // console.log('Konu çalışma süresi (saniye):', finalSubjectSeconds);
    // console.log('Mola süresi (saniye):', finalBreakSeconds);
    
    // Format data for database storage
    const sessionData = {
      totalTimeSeconds: totalSecondsWithPauses,
      activeTimeSeconds: activeTimeSeconds,
      subjectTimeSeconds: finalSubjectSeconds,
      breakTimeSeconds: finalBreakSeconds,
      formattedTotalTime: totalTimeWithPauses,
      formattedActiveTime: activeTime,
      formattedSubjectTime: formattedSubjectTime,
      formattedBreakTime: formattedBreakTime,
      endedAt: new Date().toISOString()
    };
    
    console.log('Veritabanına kaydedilecek veri:', sessionData);

    // Reset all timer states
    timerRef.current.stop();
    timerRef.current.reset();
    
    // Reset timing data
    timerDataRef.current = {
      startTime: 0,
      pauseStartTime: 0,
      totalPauseTime: 0,
      totalSubjectTime: 0,
      totalBreakTime: 0,
      isRunning: false
    };
    
    setTime(null);
    setIsPaused(false);
    setSubjectTime("00:00:00");
    setBreakTime("00:00:00");
  }, [isPaused]);

  // Create the context value object
  const contextValue: TimerContextType = {
    timer: timerRef.current,
    time,
    isPaused,
    subjectTime,
    breakTime,
    startTimer,
    stopTimer,
    resetTimer,
    finishTimer
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use the timer context
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}; 