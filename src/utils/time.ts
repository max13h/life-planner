import { moment } from 'obsidian';

export const timeNow = () => moment().format('HH:mm')
export const dateNow = () => moment().format('YYYY-MM-DD')

export const timeFromDurationAndStartTime = (start: string, durationInMinutes: number, beforeOrAfter: "before" | "after") =>{
  if (beforeOrAfter === "before") {
    return moment(start, 'HH:mm').subtract(durationInMinutes, 'minutes').format('HH:mm');
  } else {
    return moment(start, 'HH:mm').add(durationInMinutes, 'minutes').format('HH:mm');
  }
}

export const isTimeAfterTime = (isAfter: string, isBefore: string) => moment(isAfter, "HH:mm").isAfter(moment(isBefore, "HH:mm"));

export type DayName = 'today' | 'tomorrow' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export const getDayDate = (dayName: DayName) => {
  const daysMap = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  if (dayName === 'today') {
    return moment().format('YYYY-MM-DD');
  }

  if (dayName === 'tomorrow') {
    return moment().add(1, 'days').format('YYYY-MM-DD');
  }

  const targetDay = daysMap[dayName as keyof typeof daysMap];
  if (!targetDay) {
    throw new Error('Invalid day name. Please use "Monday", "Tuesday", etc.');
  }

  const today = moment();
  const daysToAdd = (targetDay + 7 - today.isoWeekday()) % 7 || 7;  // Ensure the result is the next occurrence

  return today.add(daysToAdd, 'days').format('YYYY-MM-DD');
}