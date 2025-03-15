import React, { createContext, useContext, useRef, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import Timer from './Timer';
import { formatSecondsToTime } from '../utils/timeUtils';

// Define the shape of the context
interface TimerContextType {
  timer: Timer;
  time: string | null;
  isPaused: boolean;
  breakTime: string;   // Break timer - calculated as total time minus active time
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

// Timer data interface for better type safety
interface TimerData {
  startTime: number;
  pauseStartTime: number;
  totalPauseTime: number;
  totalBreakTime: number; // Track total break time directly for more accuracy
  lastUpdateTime: number;
  isRunning: boolean;
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
  const [breakTime, setBreakTime] = useState<string>("00:00:00");
  const [breakSeconds, setBreakSeconds] = useState<number>(0); // Track break seconds separately for consistency
  
  // Reference to break interval
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to hold timer tracking data for more precise timing
  const timerDataRef = useRef<TimerData>({
    startTime: 0,
    pauseStartTime: 0,
    totalPauseTime: 0,
    totalBreakTime: 0,
    lastUpdateTime: 0,
    isRunning: false
  });
  
  // Use a stable reference for the Timer object
  const timerRef = useRef<Timer>(new Timer());
  
  // Function to calculate break time based on absolute values
  // This uses totalBreakTime and increments it during pauses
  const calculateBreakTime = useCallback((): { 
    formattedTime: string, 
    seconds: number 
  } => {
    if (!timerDataRef.current.isRunning) {
      return { formattedTime: "00:00:00", seconds: 0 };
    }
    
    let breakTimeSeconds = Math.floor(timerDataRef.current.totalBreakTime / 1000);
    
    // If currently paused, add the current pause duration
    if (isPaused && timerDataRef.current.pauseStartTime > 0) {
      const currentPauseDuration = Date.now() - timerDataRef.current.pauseStartTime;
      breakTimeSeconds = Math.floor((timerDataRef.current.totalBreakTime + currentPauseDuration) / 1000);
    }
    
    return { 
      formattedTime: formatSecondsToTime(breakTimeSeconds), 
      seconds: breakTimeSeconds 
    };
  }, [isPaused]);
  
  // Function to start the break timer interval with a shorter interval for smoother updates
  const startBreakInterval = useCallback(() => {
    // Clear any existing interval first
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
    }
    
    // Update immediately to prevent delay
    const { formattedTime, seconds } = calculateBreakTime();
    setBreakTime(formattedTime);
    setBreakSeconds(seconds);
    
    // Create a new interval that updates more frequently (250ms)
    breakIntervalRef.current = setInterval(() => {
      const { formattedTime, seconds } = calculateBreakTime();
      // Only update if seconds changed to prevent unnecessary renders
      if (seconds !== breakSeconds) {
        setBreakTime(formattedTime);
        setBreakSeconds(seconds);
      }
    }, 250); // More frequent updates for smoother counting
  }, [calculateBreakTime, breakSeconds]);
  
  // Function to stop the break timer interval
  const stopBreakInterval = useCallback(() => {
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
      breakIntervalRef.current = null;
    }
  }, []);
  
  // Update break time when necessary - using the main timer's callback to sync updates
  useEffect(() => {
    // When time changes (which happens every second via the main timer),
    // update the break time only when not paused
    if (time !== null && !isPaused) {
      const { formattedTime, seconds } = calculateBreakTime();
      // Only update if seconds changed
      if (seconds !== breakSeconds) {
        setBreakTime(formattedTime);
        setBreakSeconds(seconds);
      }
    }
  }, [time, isPaused, calculateBreakTime, breakSeconds]);
  
  // Manage break timer interval based on pause state
  useEffect(() => {
    // If timer is active (time !== null)
    if (time !== null) {
      if (isPaused) {
        // Start the break interval when paused
        startBreakInterval();
      } else {
        // Stop the break interval when running
        stopBreakInterval();
      }
    } else {
      // If timer is not active, ensure break interval is stopped
      stopBreakInterval();
    }
    
    // Cleanup on unmount
    return () => {
      stopBreakInterval();
    };
  }, [isPaused, time, startBreakInterval, stopBreakInterval]);
  
  // Start the timer - optimized with better handling of elapsed time
  const startTimer = useCallback(() => {
    const now = Date.now();
    
    if (isPaused) {
      // Coming back from a pause - precisely calculate the pause duration
      const pauseDuration = now - timerDataRef.current.pauseStartTime;
      timerDataRef.current.totalPauseTime += pauseDuration;
      
      // Add the pause duration to total break time for accurate tracking
      timerDataRef.current.totalBreakTime += pauseDuration;
      
      // Stop the break interval as we're resuming
      stopBreakInterval();
    } else {
      // First start - reset all counters
      timerDataRef.current.startTime = now;
      timerDataRef.current.totalPauseTime = 0;
      timerDataRef.current.totalBreakTime = 0;
    }
    
    timerDataRef.current.lastUpdateTime = now;
    timerDataRef.current.isRunning = true;
    
    // Start main timer with batched state updates
    timerRef.current.start((updatedTime) => {
      // Using the main timer value for everything
      setTime(updatedTime);
    });
    
    setIsPaused(false);
    // Break time will be updated via the effect when time changes
  }, [isPaused, stopBreakInterval]);

  // Stop (pause) the timer
  const stopTimer = useCallback(() => {
    const now = Date.now();
    
    if (!isPaused) {
      timerDataRef.current.pauseStartTime = now;
      
      // Start the break interval to continuously update break time
      startBreakInterval();
    }
    
    // Stop main timer
    timerRef.current.stop();
    setIsPaused(true);
    
    // Update break time immediately when pausing
    const { formattedTime, seconds } = calculateBreakTime();
    setBreakTime(formattedTime);
    setBreakSeconds(seconds);
  }, [isPaused, calculateBreakTime, startBreakInterval]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    const now = Date.now();
    
    // Stop any break interval
    stopBreakInterval();
    
    // Reset timing data with a clean object
    timerDataRef.current = {
      startTime: now,
      pauseStartTime: 0,
      totalPauseTime: 0,
      totalBreakTime: 0,
      lastUpdateTime: now,
      isRunning: true
    };
    
    // Reset main timer
    timerRef.current.reset();
    
    // Reset break time
    setBreakTime("00:00:00");
    setBreakSeconds(0);
    setIsPaused(false);
    
    // Start the timer after a small delay to ensure clean state
    setTimeout(() => {
      timerRef.current.start((updatedTime) => {
        setTime(updatedTime);
      });
      // Break time will be updated via the effect
    }, 50);
  }, [stopBreakInterval]);

  // Finish and log the timer
  const finishTimer = useCallback(() => {
    // Stop any break interval
    stopBreakInterval();
    
    // Get total and active time directly from timer
    const totalTimeWithPauses = timerRef.current.getTotalElapsedTimeWithPauses();
    const activeTime = timerRef.current.getTotalActiveTime();
    const totalSecondsWithPauses = timerRef.current.getTotalElapsedTimeWithPausesInSeconds();
    const activeTimeSeconds = timerRef.current.getTotalActiveTimeInSeconds();
    
    // Use our accurately tracked break time instead of calculating the difference
    const breakTimeSeconds = breakSeconds;
    const formattedBreakTime = formatSecondsToTime(breakTimeSeconds);

    // Format data for database storage
    const sessionData = {
      totalTimeSeconds: totalSecondsWithPauses,
      activeTimeSeconds: activeTimeSeconds,
      breakTimeSeconds: breakTimeSeconds,
      formattedTotalTime: totalTimeWithPauses,
      formattedActiveTime: activeTime,
      formattedBreakTime: formattedBreakTime,
      endedAt: new Date().toISOString()
    };
    
    console.log('Veritabanına kaydedilecek veri:', sessionData);

    // Reset all timer states efficiently
    timerRef.current.stop();
    timerRef.current.reset();
    
    // Reset timing data with a clean object for better garbage collection
    timerDataRef.current = {
      startTime: 0,
      pauseStartTime: 0,
      totalPauseTime: 0,
      totalBreakTime: 0,
      lastUpdateTime: 0,
      isRunning: false
    };
    
    // Batch state updates
    setTime(null);
    setIsPaused(false);
    setBreakTime("00:00:00");
    setBreakSeconds(0);
  }, [stopBreakInterval, breakSeconds]);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(() => ({
    timer: timerRef.current,
    time,
    isPaused,
    breakTime,
    startTimer,
    stopTimer,
    resetTimer,
    finishTimer
  }), [time, isPaused, breakTime, startTimer, stopTimer, resetTimer, finishTimer]);

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