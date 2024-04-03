"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeFormatter = void 0;
const moment = require("moment");
class DateTimeFormatter {
    convertToDate(dateString) {
        let date = moment(dateString, 'YYYY-MM-DD');
        let formattedDate = date.format('YYYY-MM-DD');
        return formattedDate;
    }
    convertToTime(timeString) {
        let parsedTime = moment(timeString, ["hh:mm A"]);
        if (timeString.includes("12:00 AM")) {
            parsedTime = moment("00:00", "HH:mm");
        }
        const time24Hour = parsedTime.format("HH:mm");
        return time24Hour;
    }
    processTimeSlot(timeSlot) {
        const [startTimeString, endTimeString] = timeSlot.split('-');
        const startTime = this.convertToTime(startTimeString);
        const endTime = this.convertToTime(endTimeString);
        return { startTime, endTime };
    }
    compareTime(time1, time2) {
        const date1 = new Date(`2000-01-01 ${time1}`);
        const date2 = new Date(`2000-01-01 ${time2}`);
        if (date1 < date2) {
            return -1;
        }
        else if (date1 > date2) {
            return 1;
        }
        else {
            return 0;
        }
    }
    isSlotOverlap(slot1, slot2) {
        const [start1, end1] = slot1.split(' - ');
        const [start2, end2] = slot2.split(' - ');
        return ((this.compareTime(start1, start2) >= 0 && this.compareTime(start1, end2) < 0) ||
            (this.compareTime(start2, start1) >= 0 && this.compareTime(start2, end1) < 0));
    }
    createTimeSlots(start_time, end_time) {
        const available_slots = {
            full_day: '10:00 AM' + ' - ' + '06:00 PM',
            half_day: [
                '10:00 AM' + ' - ' + '01:00 PM',
                '03:00 PM' + ' - ' + '06:00 PM'
            ],
        };
        return available_slots;
    }
}
exports.DateTimeFormatter = DateTimeFormatter;
//# sourceMappingURL=DateTimeFormatter.service.js.map