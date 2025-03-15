// lib/Timer.ts
import { formatMsToTime, formatSecondsToTime } from '../utils/timeUtils';

export class Timer {
    private startTime: number;
    private interval: NodeJS.Timeout | null;
    private currentTime: string;
    private onTimeUpdate?: (time: string) => void;
    private elapsedBeforePause: number;
    private isRunning: boolean;
    private initialStartTime: number; // Başlangıç zamanını saklayacak yeni değişken
    private currentSeconds: number; // Current time in seconds

    constructor() {
        this.startTime = Date.now();
        this.initialStartTime = Date.now(); // İlk başlangıç zamanını da kaydet
        this.currentTime = "00:00:00";
        this.currentSeconds = 0;
        this.interval = null;
        this.elapsedBeforePause = 0;
        this.isRunning = false;
    }

    /**
     * Returns whether the timer is currently running
     */
    public getIsRunning(): boolean {
        return this.isRunning;
    }
    
    /**
     * Alternate method to check if timer is running
     * This method is provided for compatibility
     */
    public checkIsRunning(): boolean {
        return this.isRunning;
    }

    public start(callback: (time: string) => void): void {
        // Eğer timer zaten çalışıyorsa, önce durdur
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        // Eğer ilk kez başlatılıyorsa (henüz hiç çalışmamışsa), initialStartTime'ı ayarla
        if (this.elapsedBeforePause === 0) {
            this.initialStartTime = Date.now();
        }
        
        this.onTimeUpdate = callback;
        this.isRunning = true;
        
        // Yeni başlangıç zamanını ayarla
        this.startTime = Date.now();
        
        this.interval = setInterval(() => {
            const currentElapsed = Date.now() - this.startTime;
            const totalElapsed = this.elapsedBeforePause + currentElapsed;
            this.currentSeconds = Math.floor(totalElapsed / 1000);
            this.currentTime = formatMsToTime(totalElapsed);
            
            if (this.onTimeUpdate) {
                this.onTimeUpdate(this.currentTime);
            }
        }, 1000);
    }

    public stop(): void {
        if (this.interval && this.isRunning) {
            // Timer'ı durdur
            clearInterval(this.interval);
            this.interval = null;
            
            // Durdurma anına kadar geçen süreyi hesapla ve sakla
            const currentElapsed = Date.now() - this.startTime;
            this.elapsedBeforePause += currentElapsed;
            
            this.isRunning = false;
        }
    }

    public reset(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.startTime = Date.now();
        this.initialStartTime = Date.now(); // Sıfırlarken ilk başlangıç zamanını da güncelle
        this.currentTime = "00:00:00";
        this.currentSeconds = 0;
        this.elapsedBeforePause = 0;
        this.isRunning = false;
        
        if (this.onTimeUpdate) {
            this.onTimeUpdate(this.currentTime);
        }
    }

    public getCurrentTime(): string {
        return this.currentTime;
    }
    
    /**
     * Gets the current time in seconds for database storage
     */
    public getCurrentTimeInSeconds(): number {
        return this.currentSeconds;
    }
    
    // Başlangıçtan bu yana geçen toplam süreyi hesaplar (durdurma süreleri dahil)
    public getTotalElapsedTimeWithPauses(): string {
        const now = Date.now();
        const totalRealElapsed = now - this.initialStartTime;
        return formatMsToTime(totalRealElapsed);
    }
    
    /**
     * Gets the total elapsed time including pauses in seconds
     */
    public getTotalElapsedTimeWithPausesInSeconds(): number {
        const now = Date.now();
        const totalRealElapsed = now - this.initialStartTime;
        return Math.floor(totalRealElapsed / 1000);
    }
    
    // Toplam aktif çalışma süresini döndürür (durdurma süreleri hariç)
    public getTotalActiveTime(): string {
        let totalActiveTime = this.elapsedBeforePause;
        
        if (this.isRunning) {
            totalActiveTime += (Date.now() - this.startTime);
        }
        
        return formatMsToTime(totalActiveTime);
    }
    
    /**
     * Gets the total active time in seconds for database storage
     */
    public getTotalActiveTimeInSeconds(): number {
        let totalActiveTime = this.elapsedBeforePause;
        
        if (this.isRunning) {
            totalActiveTime += (Date.now() - this.startTime);
        }
        
        return Math.floor(totalActiveTime / 1000);
    }
}

export default Timer;