

import * as moment from "moment";



export class DateTimeFormatter {


    convertToDate(dateString: any) {
        // Parse the date string using Moment.js
        let date = moment(dateString, 'YYYY-MM-DD');

        // Format the date to 'YYYY-MM-DD'
        let formattedDate = date.format('YYYY-MM-DD');
        return formattedDate;
    }

    convertToTime(timeString: any) {
        // Parse time using Moment.js
        let parsedTime = moment(timeString, ["hh:mm A"]);
        
        if(timeString.includes("12:00 AM")) {
          parsedTime = moment("00:00", "HH:mm");
        }
      
        // Convert to 24-hour format
        const time24Hour = parsedTime.format("HH:mm");
      
        return time24Hour;
      }

     processTimeSlot(timeSlot : any) {
        // Split the time slot into start time and end time
        const [startTimeString, endTimeString] = timeSlot.split('-');
    
        // Convert start and end times to 24-hour format
        const startTime =  this.convertToTime(startTimeString);
        const endTime = this.convertToTime(endTimeString);
    
        return { startTime, endTime };
    }
    compareTime(time1 : string, time2 : string) {
      // Convert time strings to Date objects for comparison
      const date1 = new Date(`2000-01-01 ${time1}`);
      const date2 = new Date(`2000-01-01 ${time2}`);
    
      if (date1 < date2) {
        return -1; // time1 is earlier
      } else if (date1 > date2) {
        return 1; // time1 is later
      } else {
        return 0; // times are equal
      }
    }
    isSlotOverlap(slot1: string, slot2: string) {
  
     
      const [start1, end1] = slot1.split(' - ');
      const [start2, end2] = slot2.split(' - ');
    
      return (
        (this.compareTime(start1, start2) >= 0 && this.compareTime(start1, end2) < 0) ||
        (this.compareTime(start2, start1) >= 0 && this.compareTime(start2, end1) < 0)
      );
    }


    createTimeSlots(start_time: string, end_time: string) {
      // Convert start and end times to 24-hour format
      // const formatted_start_time = this.convertToTime(start_time);
      // const formatted_end_time = this.convertToTime(end_time);
    
      // // Convert these times to moment objects for easy calculations
      // const start = moment(formatted_start_time, "HH:mm");
      // const end = moment(formatted_end_time, "HH:mm");
    
      // // Calculate the duration for half day slot
      // const duration = moment.duration(end.diff(start));
    
      // // Calculate the midpoint time
      // const midpoint = start.clone().add(duration.asMilliseconds() / 2, 'ms');
    
      // // Create the time slots
      // const available_slots = {
      //   full_day: start.format("hh:mm A") + ' - ' + end.format("hh:mm A"),
      //   half_day: [
      //     start.format("hh:mm A") + ' - ' + midpoint.clone().subtract(1, 'hour').format("hh:mm A"),
      //     midpoint.clone().add(1, 'hour').format("hh:mm A") + ' - ' + end.format("hh:mm A")
      //   ],
      // }

      const available_slots = {   // FOR CREATE YOUR SLOTS DYNAMIC , YOU JUST COMMENT THIS OBJECT AND UNCOMMENT ALL ABOVE CODE.
        full_day: '10:00 AM'+ ' - ' + '06:00 PM',
        half_day: [
          '10:00 AM' + ' - ' + '01:00 PM',
          '03:00 PM' + ' - ' + '06:00 PM'
        ],
      }
      return available_slots;
    }

    // createAvailableDates(bookedSlots, slotType : string, startDate : string, endDate: string) {
    //   let dateToAdd = new Date(this.convertToDate(startDate));
    //   const end_date = new Date(this.convertToDate(endDate));
    
    //   const allDatesInTourDuration = [];
    
    //   while (dateToAdd <= end_date) {
    //     allDatesInTourDuration.push(new Date(dateToAdd));
    //     dateToAdd.setDate(dateToAdd.getDate() + 1);
    //   }    
    //   const allFullDayBookedDates = bookedSlots.full_day;
    //   const allHalfDayBookedDates = bookedSlots.half_day;

    
    //   const availableDates = allDatesInTourDuration.filter(date => {
    //     // Rule 1: If full day is booked, hide this date for all
    //     if(allFullDayBookedDates.some(bookedDateString => checkBookingDate(bookedDateString, date))) return false;
    
    //     // Rule 2: If half day is booked once, hide this date for full_day
    //     if(slotType === 'full_day' && countBookings(allHalfDayBookedDates, date) >= 1) return false;
    
    //     // Rule 3: If half day is booked more than once, hide this date for half_day
    //     if((slotType === 'half_day') && countBookings(allHalfDayBookedDates, date) > 1) return false;
        
    //     // Rule 4: If full day is booked, hide this date for half_day
    //     if((slotType === 'half_day') && allFullDayBookedDates.some(bookedDateString => checkBookingDate(bookedDateString, date))) return false;
    
    //     return true;
    //   });
    
    //   function checkBookingDate(bookedDateString, date) {
    //     const bookedDate = new Date(bookedDateString);
    //     return bookedDate.getDate() === date.getDate() &&
    //       bookedDate.getMonth() === date.getMonth() &&
    //       bookedDate.getFullYear() === date.getFullYear();
    //   } 
    
    //   function countBookings(bookedDatesArray, date) {
    //     return bookedDatesArray.filter(bookedDateString => checkBookingDate(bookedDateString, date)).length;
    //   }
    
    //   return availableDates;
    // }  
    
    // createTimeSlots(start_time: string, end_time: string) {
    //   // Convert start and end times to 24-hour format
    //   const formatted_start_time = this.convertToTime(start_time);
    //   const formatted_end_time = this.convertToTime(end_time);
    
    //   // Convert these times to moment objects for easy calculations
    //   const start = moment(formatted_start_time, "HH:mm");
    //   const end = moment(formatted_end_time, "HH:mm");
    
    //   // Calculate the duration for half day slot
    //   const duration = moment.duration(end.diff(start));
    
    //   // Calculate the midpoint time
    //   const midpoint = start.clone().add(duration.asMilliseconds() / 2, 'ms');
    
    //   // Create the time slots
    //   const available_slots = {
    //     full_day: start.format("hh:mm A") + ' - ' + end.format("hh:mm A"),
    //     half_day: [
    //       start.format("hh:mm A") + ' - ' + midpoint.clone().subtract(1, 'hour').format("hh:mm A"),
    //       midpoint.clone().add(1, 'hour').format("hh:mm A") + ' - ' + end.format("hh:mm A")
    //     ],
    //     // hourly_bases: []
    //   }
    
    //   // Generate hourly slots
    //   // let hourSlotStart = start.clone();
    //   // while (hourSlotStart < end) {
    //   //   let hourSlotEnd = hourSlotStart.clone().add(1, 'hour');
    //   //   if (hourSlotEnd > end) {
    //   //     hourSlotEnd = end.clone();
    //   //   }
    
    //   //   // available_slots.hourly_bases.push(hourSlotStart.format("hh:mm A") + ' - ' + hourSlotEnd.format("hh:mm A"));
    
    //   //   hourSlotStart.add(1, 'hour');
    //   // }
    
    //   return available_slots;
    // }

   
}