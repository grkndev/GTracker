/**
 * Formats seconds into a human-readable time string (HH:MM:SS)
 * @param totalSeconds Number of seconds to format
 * @returns Formatted time string (HH:MM:SS)
 */
export function formatSecondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number): string => num.toString().padStart(2, '0');
    
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats milliseconds into a human-readable time string (HH:MM:SS)
 * @param ms Number of milliseconds to format
 * @returns Formatted time string (HH:MM:SS)
 */
export function formatMsToTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    return formatSecondsToTime(totalSeconds);
}

/**
 * Parses a time string (HH:MM:SS) into total seconds
 * @param timeString Time string in format HH:MM:SS
 * @returns Total seconds represented by the time string
 */
export function parseTimeToSeconds(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
} 