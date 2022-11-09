import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { first } from "lodash";
import { PeriodInterface } from '../resources/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PeriodFilter {
  period?: string;

  years?: PeriodInterface[];

  constructor() {}

  filterPeriod(_periodType: string, year?: number) {
    switch (_periodType) {
      case 'Yearly':
        let currrentyear = new Date().getFullYear();

        this.years = [
          {
            name: currrentyear.toString(),
            value: currrentyear,
          },
        ];

        for (let i = 1; i <= 20; i++) {
          this.years.push({
            name: (currrentyear - i).toString(),
            value: currrentyear - i,
          });
        }
        return this.years;

      case 'Monthly':
        return [
          {
            name: 'January',
            value: 0,
          },
          {
            name: 'February',
            value: 1,
          },
          {
            name: 'March',
            value: 2,
          },
          {
            name: 'April',
            value: 3,
          },
          {
            name: 'May',
            value: 4,
          },
          {
            name: 'June',
            value: 5,
          },
          {
            name: 'July',
            value: 6,
          },
          {
            name: 'August',
            value: 7,
          },
          {
            name: 'September',
            value: 8,
          },
          {
            name: 'October',
            value: 9,
          },
          {
            name: 'November',
            value: 10,
          },
          {
            name: 'December',
            value: 11,
          },
        ];
      case 'Weekly':
        return this.weeksInYear(year!)
      default:
        return undefined;
    }
  }

  calculateDates(_periodType: string, value?: number, year?: number) {
    year = year === undefined ? new Date().getFullYear() : year;
    let firstDateObject;
    let lastDateObject;
    let firstDate;
    let lastDate;

    switch (_periodType) {
      case 'Yearly':
        value = value === undefined ? new Date().getFullYear() : value;

        //Create date objects
        firstDateObject = new Date(value!, 0, 1);
        lastDateObject = new Date(value!, 11, 31);

        //Format dates accordingly
        firstDate =
          firstDateObject.getFullYear() +
          '-' +
          (firstDateObject.getMonth() + 1) +
          '-' +
          firstDateObject.getDate();
        lastDate =
          lastDateObject.getFullYear() +
          '-' +
          (lastDateObject.getMonth() + 1) +
          '-' +
          lastDateObject.getDate();

        return {
          firstDate: firstDate,
          lastDate: lastDate,
        };

      case 'Monthly':
        //Create date objects
        firstDateObject = new Date(year!, value!, 1);

        lastDateObject = new Date(
          firstDateObject.getFullYear(),
          firstDateObject.getMonth() + 1,
          0
        );

        //Format dates accordingly
        firstDate =
          firstDateObject.getFullYear() +
          '-' +
          (firstDateObject.getMonth() + 1) +
          '-' +
          firstDateObject.getDate();
        lastDate =
          lastDateObject.getFullYear() +
          '-' +
          (lastDateObject.getMonth() + 1) +
          '-' +
          lastDateObject.getDate();

        return {
          firstDate: firstDate,
          lastDate: lastDate,
        };

      case 'Weekly':
        let weekObject =  this.getDateRangeOfWeek(value!, year!);
        return {
          firstDate: weekObject.firstDate,
          lastDate: weekObject.lastDate,
        }
      default:
        return undefined;
    }
  }

  getperiod(_periodType: string, date: string) {
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    let value: string;

    switch (_periodType) {
      case 'Yearly':
        return `${year}`;
      case 'Monthly':
        value = String(month).length > 1 ? String(month) : `0${month}`;
        return `${year}${value}`;
      case 'Weekly':
        let weekNumber = this.getWeekNumber(new Date(date));
        value =
          String(weekNumber).length > 1 ? String(weekNumber) : `0${weekNumber}`;
        return `${year}W${value}`;
      default:
        return 'Not supported';
    }
  }

  weeksInYear(year: number) {
    let month;
    let week;
    let day;

    if (year === new Date().getFullYear()) {
      month = new Date().getMonth();
      day = new Date().getDate();
    } else {
      month = 11;
      day = 31;
    }

    // Find week that last date in a given year. If is first week, reduce date until
    // get previous week.
    if (year !== new Date().getFullYear()) {
      do {
        let d = new Date(year, month, day--);
        week = this.getWeekNumber(d);
      } while (week == 1);
    } else {
      week = this.getWeekNumber(new Date());
    }

    let weekObjects = [];

    for (let i = 1; i <= week; i++) {
      let weekValues = this.getDateRangeOfWeek(i, year);
      let weekObject = {
        name: `Week ${weekValues.weekNumber} (${weekValues.firstDate} - ${weekValues.lastDate})`,
        value: weekValues.weekNumber
      }
      weekObjects.push(weekObject);
    }

    return weekObjects;
  }

  getWeekNumber(date: Date) {
    // initialize a new date object
    let d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );

    let startDate = new Date(date.getFullYear(), 0, 1);
    var days = Math.floor(
      (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    let weekNumber = Math.ceil(days / 7);

    return weekNumber;
  }

  getDateRangeOfWeek(weekNo: number, year: number) {
    var d1 = new Date(year, 11, 31);
    const numOfdaysPastSinceLastMonday = eval(String((d1.getDay()+1) - 1));

    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);

    let weekNoToday = this.getWeekNumber(d1);
    let weeksInTheFuture = (weekNo - weekNoToday);

    d1.setDate(d1.getDate() + (7 * weeksInTheFuture));
    let rangeIsFrom = String(
      d1.getDate() + '/' + (d1.getMonth() + 1) + '/' + d1.getFullYear()
    );

    d1.setDate(d1.getDate() + 6);
    let rangeIsTo = String(
      d1.getDate() + '/' + (d1.getMonth() + 1) + '/' + d1.getFullYear()
    );

    return {
      firstDate: rangeIsFrom,
      lastDate: rangeIsTo,
      weekNumber: weekNo,
    };
  }
}

