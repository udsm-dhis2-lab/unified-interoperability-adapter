export function formatDateToYYMMDD(dateValue: any, reverse: boolean = false) {
  return reverse
    ? formatMonthOrDate(dateValue.getDate(), 'd') +
        '-' +
        formatMonthOrDate(dateValue.getMonth() + 1, 'm') +
        '-' +
        dateValue.getFullYear()
    : dateValue.getFullYear() +
        '-' +
        formatMonthOrDate(dateValue.getMonth() + 1, 'm') +
        '-' +
        formatMonthOrDate(dateValue.getDate(), 'd');
}

function formatMonthOrDate(value: string, type: string) {
  if (type == 'm' && value.toString().length == 1) {
    return '0' + value;
  } else if (type == 'd' && value.toString().length == 1) {
    return '0' + value;
  } else {
    return value;
  }
}
