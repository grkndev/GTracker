// lib/Timer.ts
export class Timer {
    private startTime: number;
    private interval: NodeJS.Timer | null;
    private currentTime: string;
    private onTimeUpdate?: (time: string) => void;

    constructor() {
        this.startTime = Date.now();
        this.currentTime = "00:00:00";
        this.interval = null;
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
        this.onTimeUpdate = callback;
        
        this.interval = setInterval(() => {
            const elapsedTime = Date.now() - this.startTime;
            this.currentTime = this.formatTime(elapsedTime);
            
            if (this.onTimeUpdate) {
                this.onTimeUpdate(this.currentTime);
            }
        }, 1000);
    }

    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    public reset(): void {
        this.startTime = Date.now();
        this.currentTime = "00:00:00";
        
        if (this.onTimeUpdate) {
            this.onTimeUpdate(this.currentTime);
        }
    }

    public getCurrentTime(): string {
        return this.currentTime;
    }
}

export default Timer;