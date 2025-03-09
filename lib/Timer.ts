// lib/Timer.ts
export class Timer {
    private startTime: number;
    private interval: NodeJS.Timeout | null;
    private currentTime: string;
    private onTimeUpdate?: (time: string) => void;
    private elapsedBeforePause: number;
    private isRunning: boolean;
    private initialStartTime: number; // Başlangıç zamanını saklayacak yeni değişken

    constructor() {
        this.startTime = Date.now();
        this.initialStartTime = Date.now(); // İlk başlangıç zamanını da kaydet
        this.currentTime = "00:00:00";
        this.interval = null;
        this.elapsedBeforePause = 0;
        this.isRunning = false;
    }

    private formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num: number): string => num.toString().padStart(2, '0');
        
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
            this.currentTime = this.formatTime(totalElapsed);
            
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
        this.elapsedBeforePause = 0;
        this.isRunning = false;
        
        if (this.onTimeUpdate) {
            this.onTimeUpdate(this.currentTime);
        }
    }

    public getCurrentTime(): string {
        return this.currentTime;
    }
    
    // Başlangıçtan bu yana geçen toplam süreyi hesaplar (durdurma süreleri dahil)
    public getTotalElapsedTimeWithPauses(): string {
        const now = Date.now();
        const totalRealElapsed = now - this.initialStartTime;
        return this.formatTime(totalRealElapsed);
    }
    
    // Toplam aktif çalışma süresini döndürür (durdurma süreleri hariç)
    public getTotalActiveTime(): string {
        let totalActiveTime = this.elapsedBeforePause;
        
        if (this.isRunning) {
            totalActiveTime += (Date.now() - this.startTime);
        }
        
        return this.formatTime(totalActiveTime);
    }
}

export default Timer;