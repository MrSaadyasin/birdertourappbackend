export declare class DateTimeFormatter {
    convertToDate(dateString: any): string;
    convertToTime(timeString: any): string;
    processTimeSlot(timeSlot: any): {
        startTime: string;
        endTime: string;
    };
    compareTime(time1: string, time2: string): 0 | 1 | -1;
    isSlotOverlap(slot1: string, slot2: string): boolean;
    createTimeSlots(start_time: string, end_time: string): {
        full_day: string;
        half_day: string[];
    };
}
