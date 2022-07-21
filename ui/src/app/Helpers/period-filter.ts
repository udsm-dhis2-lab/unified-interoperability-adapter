import { Injectable } from '@angular/core';
import { first } from "lodash";
import { PeriodInterface } from '../resources/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PeriodFilter {
  
  years?: PeriodInterface[];

  constructor() {}

  filterPeriod(_periodType: string) {
    if (_periodType === 'Yearly') {
      let currrentyear = new Date().getFullYear();

      this.years = [
        {
          name: currrentyear.toString(),
          value: currrentyear,
        },
      ];

      for (let i = 1; i <= 20; i++) {
        this.years.push({
          name: (currrentyear - (i)).toString(),
          value: currrentyear - (i),
        });
      }
      return this.years;
    } 
    else if (_periodType === 'Monthly') {
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
    } else return undefined;
  }

  calculateDates(_periodType: string, value?: number, year?: number) {
    year = year === undefined ? new Date().getFullYear() : year;

    if (_periodType === 'Yearly') {
      value = value === undefined ? new Date().getFullYear() : value;

      //Create date objects
      let firstDateObject = new Date(value!, 0, 1);
      let lastDateObject = new Date(value!, 11, 31);

      //Format dates accordingly
      let firstDate =
        firstDateObject.getFullYear() +
        '-' +
        (firstDateObject.getMonth() + 1) +
        '-' +
        firstDateObject.getDate();
      let lastDate =
        lastDateObject.getFullYear() +
        '-' +
        (lastDateObject.getMonth() + 1) +
        '-' +
        lastDateObject.getDate();

      return {
        firstDate: firstDate,
        lastDate: lastDate,
      };
    } 
    else if (_periodType === 'Monthly') {
      //Create date objects
      let firstDateObject = new Date(year!, value!, 1);
      console.log("First Date Object: ",firstDateObject)

      let lastDateObject = new Date(firstDateObject.getFullYear(), firstDateObject.getMonth()+1, 0);

      //Format dates accordingly
      let firstDate =
        firstDateObject.getFullYear() +
        '-' +
        (firstDateObject.getMonth() + 1) +
        '-' +
        firstDateObject.getDate();
      let lastDate =
        lastDateObject.getFullYear() +
        '-' +
        (lastDateObject.getMonth() + 1) +
        '-' +
        lastDateObject.getDate();

      return {
        firstDate: firstDate,
        lastDate: lastDate,
      };
    } else return undefined;
  }
}


